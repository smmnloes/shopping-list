import axios from 'axios'
import { AuthStatus } from '../providers/auth-provider.tsx'
import axiosRetry, { isIdempotentRequestError } from 'axios-retry'
import qs from 'qs'

export const backendHost = import.meta.env.VITE_BACKEND_HOST


export const axiosInstance = axios.create({
  withCredentials: true,
  paramsSerializer:
    params => qs.stringify(params, { allowEmptyArrays: true })
})
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: isIdempotentRequestError
})

export const register = async (registrationReq: {
  credentials: { username: string, password: string },
  registrationSecret: string
}): Promise<AuthStatus> => {
  return axiosInstance.post(`${ backendHost }/api/auth/register`, registrationReq).then(response => response.data)
}

export const login = async (username: string, password: string): Promise<AuthStatus> => {
  return axiosInstance.post(`${ backendHost }/api/auth/login`, { username, password }).then(response => response.data)
}

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  return axiosInstance.post(`${ backendHost }/api/auth/changepassword`, {
    currentPassword,
    newPassword
  }).then(response => response.data)
}


export const logout = async () => {
  return axiosInstance.post(`${ backendHost }/api/auth/logout`, {}).then(response => response.data)
}

export const getAuthStatus = async (): Promise<AuthStatus> => {
  return axiosInstance.get(`${ backendHost }/api/auth`).then(response => response.data)
}


export const onlineStatus = async () => {
  return axiosInstance.get(`${ backendHost }/api/onlinestatus`)
}

export const getServerVersion = async (): Promise<string> => {
  return axiosInstance.get(`${ backendHost }/api/version`).then(response => response.data)
}
