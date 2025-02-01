import '../styles/takeout-tracker.scss'
import { useEffect, useState } from 'react'
import { claimPayment, confirmPayment, getCurrentTakeoutState } from '../api/takeout.ts'
import { TakeoutStateFrontend } from '../../../shared/types/takeout'
import { formatDate } from '../utils/date-time-format.ts'


const TakeOutTracker = () => {
  const [ {
    users,
    possibleActions,
    waitingForConfirmation,
    latestPayments
  }, setTakeoutState ] = useState<TakeoutStateFrontend>({} as TakeoutStateFrontend)

  useEffect(() => {
    refresh()
  }, [])


  const refresh = async () => {
    const takeoutState = await getCurrentTakeoutState()
    setTakeoutState(takeoutState)
  }

  const getPointDirection = () => users?.[0].hasToPay ? 'LEFT' : users?.[1].hasToPay ? 'RIGHT' : 'UP'
  const userNameHasToPay = users?.find(user => user.hasToPay)?.name ?? ''
  const userNameNotHasToPay = users?.find(user => !user.hasToPay)?.name ?? ''

  const getInteractionComponent = () => {
    if (possibleActions?.claim) {
      return <button className="my-button" onClick={ async () => {
        await claimPayment()
        await refresh()
      } }>Ich habe bezahlt!</button>
    } else if (possibleActions?.confirm) {
      return <button className="my-button" onClick={ async () => {
        await confirmPayment()
        await refresh()
      } }>Bestätigen, dass { userNameHasToPay } bezahlt hat!</button>
    } else if (waitingForConfirmation) {
      return <p>Warte auf Bestätigung von { userNameNotHasToPay }...</p>
    } else return null
  }

  return (<>
      <div className="takeoutTracker">
        <h1>Wer ist dran mit Takeout?</h1>
        <div className="takeoutNames"><span>{ users?.[0].name }</span><span>{ users?.[1].name }</span></div>
        <div className="pointHand"><img className={ `point-${ getPointDirection().toLowerCase() }` }
                                        src="/point-hand.svg"
                                        alt="point hand"/></div>
        <div className="interaction">
          { getInteractionComponent()
          }
        </div>
        <div className="takeoutHistory">
          <h3>History</h3>
          { latestPayments?.map((payment, index) =>
            <div className="historyElement" key={ index }>
              <b>{ users.find(u => u.id === payment.createdById)?.name }</b> ({ formatDate(new Date(payment.createdAt)) })
            </div>) }
        </div>
      </div>
    </>
  )

}

export default TakeOutTracker