import axios from 'axios'
import { AuthStatus } from '../services/auth-provider.tsx'
import axiosRetry from 'axios-retry'

export const backendHost = import.meta.env.VITE_BACKEND_HOST


export const axiosInstance = axios.create({
  withCredentials: true
})
axiosRetry(axiosInstance, { retries: 3, retryDelay: axiosRetry.exponentialDelay })

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
