import { useBlocker } from 'react-router-dom'
import ChoiceModal from './choice-modal.tsx'

const PreventNavigation = ({
                             when,
                             message
                           }: { when: boolean, message: React.JSX.Element }) => {

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return when && currentLocation.pathname !== nextLocation.pathname
    }
  )

  return <ChoiceModal initialVisibility={ blocker.state === 'blocked' } message={ message }
                      onConfirm={ () => blocker.state === 'blocked' && blocker.proceed() }
                      onCancel={ () => blocker.state === 'blocked' && blocker.reset() }
  />

}

export default PreventNavigation