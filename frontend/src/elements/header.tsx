import { useAuth } from '../providers/auth-provider.tsx'
import { useLocation, useNavigate } from 'react-router-dom'
import useServerVersion from '../hooks/use-server-version.ts'
import packageJson from '../../../package.json'
import { useOnlineStatus } from '../providers/online-status-provider.tsx'
import ChoiceModal, { ChoiceModalHandler } from './choice-modal.tsx'
import { useEffect, useRef } from 'react'

function Header() {
  const { authStatus } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const serverVersion = useServerVersion()
  const isOnline = useOnlineStatus()
  const modalRef = useRef<ChoiceModalHandler | null>(null)

  useEffect(() => {
    if (serverVersion && (serverVersion.version !== packageJson.version)) {
      modalRef.current?.showModal()
    }
  }, [ serverVersion?.version ])


  /**
   * Delete the workbox-cache which caches index.html when new version is available
   */
  const handleNewVersionReload = async () => {
    if ('serviceWorker' in navigator) {
      const cacheNames = await caches.keys()
      const workboxCache = cacheNames.find(name => name.includes('workbox'))
      if (workboxCache) {
        await caches.delete(workboxCache)
      }
      window.location.reload()
    }
  }

  return (
    <>
      <header className="header">
        <div className="offline-banner" hidden={ isOnline }>
          du bist offline
        </div>

        <ChoiceModal
          ref={ modalRef }
          onConfirm={ handleNewVersionReload }
          message={ <span>Es gibt eine neuere Version der App ({ serverVersion?.version })<br/>Neu laden?</span> }/>

        <div className="userMenu" style={ { visibility: authStatus?.authenticated ? 'visible' : 'hidden' } }>
          <div className={ `userCircle ${ location.pathname === '/account' ? 'active' : '' }` }
               onClick={ () => location.pathname === '/account' ? navigate(-1) : navigate('/account') }>{ authStatus?.username?.charAt(0).toUpperCase() }</div>
        </div>

      </header>
    </>
  )
}

export default Header




