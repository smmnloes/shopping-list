import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

const PreventNavigation = ({
                             when,
                             message
                           }: { when: boolean, message: string }) => {

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return when && currentLocation.pathname !== nextLocation.pathname
    }
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const proceed = window.confirm(message)
      if (proceed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [ blocker, message ])

  return null
}

export default PreventNavigation