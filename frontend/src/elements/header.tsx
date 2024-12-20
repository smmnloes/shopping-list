import { useAuth } from '../services/auth-provider.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import useOnlineStatus from '../hooks/use-online-status.ts'
import { useEffect, useState } from 'react'
import useServerVersion from '../hooks/use-server-version.ts'
import packageJson from '../../../package.json'

function Header() {
  const { authStatus } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const serverVersion = useServerVersion()
  const isOnline = useOnlineStatus()

  const [ versionModalVisible, setVersionModalVisible ] = useState<boolean>(false)

  useEffect(() => {
    if (serverVersion && (serverVersion.version !== packageJson.version)) {
      setVersionModalVisible(true)
    }
  }, [ serverVersion?.version, serverVersion?.checkTime ])


  return (
    <>
      <header className="header">
        <div className="offline-banner" hidden={ isOnline }>
          du bist offline
        </div>

        <div id="modal-overlay" className={ `modal-overlay ${ versionModalVisible ? 'visible' : '' }` }
             onClick={ (e) => {
               if ((e.target as any).id === 'modal-overlay') setVersionModalVisible(false)
             } }>
          <div className="choiceModal">
            <span>Es gibt eine neuere Version der App ({ serverVersion?.version })<br/>Neu laden?</span>
            <div className="choiceModalButtons">
              <button className="my-button" onClick={ async () => {
                navigate(0)
              } }>Ja
              </button>
              <button className="my-button" onClick={ () => setVersionModalVisible(false) }>Nein</button>
            </div>

          </div>
        </div>


        <div className="userMenu" style={ { visibility: authStatus?.authenticated ? 'visible' : 'hidden' } }>
          <div className="userCircle"
               onClick={ () => navigate(location.pathname === '/account' ? '/' : '/account') }>{ authStatus?.username?.charAt(0).toUpperCase() }</div>
        </div>

      </header>
    </>
  )
}

export default Header




