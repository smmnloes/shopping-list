import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getAuthStatus } from '../api/api.ts'

interface AuthContextProps {
  authStatus: AuthStatus | null
  setAuthStatus: (status: AuthStatus) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [ authStatus, setAuthStatus ] = useState<AuthStatus | null>(null)
  const location = useLocation();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const status = await getAuthStatus().then(result => result.data).catch(_ => ({authenticated: false}))
      setAuthStatus(status)
    }

    fetchAuthStatus()
  }, [location])

  return (
    <AuthContext.Provider value={{ authStatus,
    setAuthStatus }}>
  {children}
  </AuthContext.Provider>
)
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type AuthStatus = {
  authenticated: boolean,
  username?: string
}