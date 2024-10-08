import { AuthStatus, useAuth } from '../services/auth-provider.tsx'
import OnlineStatus from './online-status.tsx'

function Header() {
  const {authStatus} = useAuth()
  const authenticatedView = (authStatus: AuthStatus | null): string => {
    if (authStatus === null) {
      return 'checking...'
    }
    return authStatus.authenticated ? `angemeldet als "${authStatus.username}"` : 'nicht angemeldet'
  }
  return (
    <>
      <header>
        <OnlineStatus/>
        <p>{ authenticatedView(authStatus) }</p>
      </header>
    </>
  )
}

export default Header




