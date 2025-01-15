import '../styles/takeout-tracker.scss'
import { useEffect, useState } from 'react'
import { getCurrentTakeoutState, switchTakeout } from '../api/takeout.ts'

type PointDirection = 'LEFT' | 'RIGHT'

const TakeOutTracker = () => {
  const [ pointDirection, setPointDirection ] = useState<PointDirection>()
  const [ usernames, setUserNames ] = useState<[ string, string ]>()
  const [ canSwitch, setCanSwitch ] = useState<boolean>(false)

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    const { usernames, hasToPayName, permissions: { canSwitch } } = await getCurrentTakeoutState()
    setUserNames([ usernames[0], usernames[1] ])
    setCanSwitch(canSwitch)
    setPointDirection(hasToPayName === usernames[0] ? 'LEFT' : hasToPayName === usernames[1] ? 'RIGHT' : undefined)
  }

  return (
    <div className="takeoutTracker">
      <div className="takeoutNames"><span>{ usernames?.[0] }</span><span>{ usernames?.[1] }</span></div>
      <div className="pointHand"><img className={ `point-${ pointDirection?.toLowerCase() ?? 'up' }` }
                                      src="/point-hand.svg"
                                      alt="point hand"/></div>
      <button className="my-button"
              disabled={ !canSwitch }
              onClick={ () => switchTakeout().then(_ => refresh()) }>Ich habe bezahlt!
      </button>
    </div>
  )

}

export default TakeOutTracker
