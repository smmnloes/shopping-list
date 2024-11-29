import { useAuth } from '../services/auth-provider.tsx'
import { logout } from '../api/api.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import useOnlineStatus from '../hooks/use-online-status.ts'
import { useEffect, useState } from 'react'

function Header() {
  const {authStatus, setAuthStatus} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [ userMenuExpanded, setUserMenuExpanded ] = useState<boolean>(false)

  useEffect(() => {
    setUserMenuExpanded(false)
  }, [location.pathname])


  const isOnline = useOnlineStatus()

  const handleLogout = async () => {
    await logout()
    setAuthStatus({authenticated: false})
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <div className="offline-banner" hidden={ isOnline }>
          du bist offline
        </div>
        <div className="userMenu" style={{ visibility: authStatus?.authenticated ? 'visible' : 'hidden' }}>
          <div className="userCircle"
               onClick={ () => setUserMenuExpanded(!userMenuExpanded) }>{ authStatus?.username?.charAt(0).toUpperCase() }</div>
          <div className="userMenuContent" style={ {opacity: userMenuExpanded && authStatus?.authenticated ? 1 : 0} }>
            <div className="usernameDisplay">angemeldet als<br/><b>{ authStatus?.username }</b></div>
            <button className="my-button" onClick={ handleLogout }>abmelden</button>
          </div>
        </div>

      </header>
    </>
  )
}

export default Header




