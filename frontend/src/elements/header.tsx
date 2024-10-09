import { AuthStatus, useAuth } from '../services/auth-provider.tsx'

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
      <header className="header">
        <p>{ authenticatedView(authStatus) }</p>
      </header>
    </>
  )
}

export default Header




