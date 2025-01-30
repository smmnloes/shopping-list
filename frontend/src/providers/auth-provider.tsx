import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getAuthStatus } from '../api/api.ts'
import { useLocation } from 'react-router-dom'
import { AuthStatus } from '../../../shared/types/auth'

interface AuthContextProps {
  authStatus: AuthStatus | null
  setAuthStatus: (status: AuthStatus) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ authStatus, setAuthStatus ] = useState<AuthStatus | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    (async () => {
      const status = await getAuthStatus().catch(_ => ({ authenticated: false }))
      setAuthStatus(status)
    })()
  }, [ pathname ])

  return (
    <AuthContext.Provider value={ {
      authStatus,
      setAuthStatus
    } }>
      { children }
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

