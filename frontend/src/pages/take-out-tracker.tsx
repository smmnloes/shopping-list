import '../styles/takeout-tracker.scss'
import { useEffect, useState } from 'react'
import { claimPayment, confirmPayment, getCurrentTakeoutState } from '../api/takeout.ts'
import { TakeoutStateFrontend, TakeoutUserInfo } from '../../../shared/types/takeout'


const TakeOutTracker = () => {
  const [ users, setUsers ] = useState<[ TakeoutUserInfo, TakeoutUserInfo ]>()
  const [ possibleActions, setPossibleActions ] = useState<TakeoutStateFrontend['possibleActions']>()
  const [ waitingForConfirmation, setWaitingForConfirmation ] = useState<boolean>()

  useEffect(() => {
    refresh()
  }, [])


  const refresh = async () => {
    const { users, possibleActions, waitingForConfirmation } = await getCurrentTakeoutState()
    setUsers([ users[0], users[1] ])
    setPossibleActions(possibleActions)
    setWaitingForConfirmation(waitingForConfirmation)
  }

  const getPointDirection = () => users?.[0].hasToPay ? 'LEFT' : users?.[1].hasToPay ? 'RIGHT' : 'UP'

  return (<>
      <div className="takeoutTracker">
        <h1>Wer ist dran mit Takeout?</h1>
        <div className="takeoutNames"><span>{ users?.[0].name }</span><span>{ users?.[1].name }</span></div>
        <div className="pointHand"><img className={ `point-${ getPointDirection().toLowerCase() }` }
                                        src="/point-hand.svg"
                                        alt="point hand"/></div>
        { (() => {
          if (possibleActions?.claim) {
            return <button className="my-button" onClick={ async () => {
              await claimPayment()
              await refresh()
            } }>Claim!</button>
          } else if (possibleActions?.confirm) {
            return <button className="my-button" onClick={ async () => {
              await confirmPayment()
              await refresh()
            } }>Confirm!</button>
          } else if (waitingForConfirmation) {
            return <p>Waiting for confirmation!</p>
          } else return <p>Alles paletti!</p>
        })()
        }
      </div>
    </>
  )

}

export default TakeOutTracker
