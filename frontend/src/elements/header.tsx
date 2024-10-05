import { AuthStatus, useAuth } from '../services/auth-provider.tsx'

function Header() {
  const {authStatus} = useAuth()
  const authenticatedView = (authStatus: AuthStatus | null): string => {
    if (authStatus === null) {
      return 'checking...'
    }
    return authStatus.authenticated ? 'true' : 'false'
  }
  return (
    <>
      <p>Authenticated: { authenticatedView(authStatus) }</p>
      <p>Username: { authStatus?.username || '' } </p>
    </>
  )
}

export default Header




