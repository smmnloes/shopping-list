import { useBlocker } from 'react-router-dom'
import ChoiceModal, { ChoiceModalHandler } from './choice-modal.tsx'
import { useEffect, useRef } from 'react'

const PreventNavigation = ({
                             when,
                             message
                           }: { when: boolean, message: React.JSX.Element }) => {

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return when && currentLocation.pathname !== nextLocation.pathname
    }
  )

  const preventNavigationModalRef = useRef<ChoiceModalHandler | null>(null)

  useEffect(() => {
    if (blocker.state === 'blocked' && preventNavigationModalRef.current) {
      preventNavigationModalRef.current.showModal()
    }
  }, [blocker.state])

  return <ChoiceModal ref={preventNavigationModalRef} message={ message }
                      onConfirm={ () => blocker.state === 'blocked' && blocker.proceed() }
                      onCancel={ () => blocker.state === 'blocked' && blocker.reset() }
  />

}

export default PreventNavigation