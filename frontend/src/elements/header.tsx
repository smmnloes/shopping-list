import { AuthStatus, useAuth } from '../services/auth-provider.tsx'

function Header() {
  const {authStatus} = useAuth()
  const authenticatedView = (authStatus: AuthStatus | null): string => {
    if (authStatus === null) {
      return 'prüfe...'
    }
    return authStatus.authenticated ? `angemeldet als "${ authStatus.username }"` : 'nicht angemeldet'
  }
  return (
    <>
      <div className="authHeader">
        { authenticatedView(authStatus) }
      </div>
    </>
  )
}

export default Header




