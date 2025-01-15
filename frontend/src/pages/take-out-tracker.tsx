import '../styles/takeout-tracker.scss'
import { useEffect, useState } from 'react'
import { getCurrentTakeoutState, switchTakeout } from '../api/takeout.ts'


const TakeOutTracker = () => {
  const [ nextToPay, setNextToPay ] = useState<string>()
  const [ usernames, setUserNames ] = useState<[ string, string ]>()

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    const { usernames, hasToPayName } = await getCurrentTakeoutState()
    setUserNames([ usernames[0], usernames[1] ])
    setNextToPay(hasToPayName)
  }

  const getPointDirection = () => nextToPay === usernames?.[0] ? 'LEFT' : nextToPay === usernames?.[1] ? 'RIGHT' : 'UP'

  return (<>
      <div className="takeoutTracker">
        <h1>Wer ist dran mit Takeout?</h1>
        <div className="takeoutNames"><span>{ usernames?.[0] }</span><span>{ usernames?.[1] }</span></div>
        <div className="pointHand"><img className={ `point-${ getPointDirection().toLowerCase() }` }
                                        src="/point-hand.svg"
                                        alt="point hand"/></div>
        <button className="my-button"
                onClick={ () => switchTakeout().then(_ => refresh()) }>{ nextToPay } hat bezahlt!
        </button>
      </div>
    </>
  )

}

export default TakeOutTracker
