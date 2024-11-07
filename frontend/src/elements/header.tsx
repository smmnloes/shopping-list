import { AuthStatus, useAuth } from '../services/auth-provider.tsx'
import { logout } from '../api/api.ts'
import { useNavigate } from 'react-router-dom'
import useOnlineStatus from '../hooks/useOnlineStatus.ts'

function Header() {
  const {authStatus, setAuthStatus} = useAuth()
  const navigate = useNavigate()
  const authenticatedView = (authStatus: AuthStatus | null): string => {
    if (authStatus === null) {
      return 'checking...'
    }
    return authStatus.authenticated ? `angemeldet als ${ authStatus.username }` : 'nicht angemeldet'
  }

  const isOnline = useOnlineStatus();

  const handleLogout = async () => {
    await logout()
    setAuthStatus({authenticated: false})
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <div className="offline-banner" hidden={isOnline}>
          du bist offline
        </div>
        <div>{ authenticatedView(authStatus) }</div>
        { authStatus?.authenticated && (<button onClick={ handleLogout }>Logout</button>) }
      </header>
    </>
  )
}

export default Header




