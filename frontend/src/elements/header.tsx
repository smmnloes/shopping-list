import { AuthStatus, useAuth } from '../services/auth-provider.tsx'
import { logout, onlineStatus } from '../api/api.ts'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Header() {
  const {authStatus, setAuthStatus} = useAuth()
  const navigate = useNavigate()
  const authenticatedView = (authStatus: AuthStatus | null): string => {
    if (authStatus === null) {
      return 'checking...'
    }
    return authStatus.authenticated ? `angemeldet als ${ authStatus.username }` : 'nicht angemeldet'
  }

  // TODO refactor out into own component, make certain actions unavailable when offline (global context)
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await onlineStatus();
        setIsOnline(response.status === 200);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkStatus();

    const intervalId = setInterval(checkStatus, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    await logout()
    setAuthStatus({authenticated: false})
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <div>{ authenticatedView(authStatus) }</div>
        { authStatus?.authenticated && (<button onClick={ handleLogout }>Logout</button>) }
        <div className="onlineIndicator">{isOnline ? 'online': 'offline'}</div>
      </header>
    </>
  )
}

export default Header




