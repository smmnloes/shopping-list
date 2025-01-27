import '../styles/takeout-tracker.scss'
import { useEffect, useState } from 'react'
import { getCurrentTakeoutState } from '../api/takeout.ts'
import { TakeoutPaymentFrontend } from '../../../shared/types/takeout'

type User = { id: number, name: string }

const TakeOutTracker = () => {
  const [ state, setState ] = useState<State>()
  const [ users, setUsers ] = useState<[ User, User ]>()

  useEffect(() => {
    refresh()
  }, [])

  const getState = (payments: TakeoutPaymentFrontend[]) => {
    const latestPayment = payments[0]
    if (latestPayment.createdById)

  }
  const refresh = async () => {
    const { users, payments } = await getCurrentTakeoutState()
    setUsers([ users[0], users[1] ])
    setState(getState(payments))
  }

  // point direction, button, message   <- defined by: latestPayment id, confirmed, if not confirmed -> next is latest, if confirmed, next is other one
  // easier: get latest confirmed payment, set other one as next ;)
  const getPointDirection = () => nextToPay === users?.[0] ? 'LEFT' : nextToPay === users?.[1] ? 'RIGHT' : 'UP'

  return (<>
      <div className="takeoutTracker">
        <h1>Wer ist dran mit Takeout?</h1>
        <div className="takeoutNames"><span>{ users?.[0].name }</span><span>{ users?.[1].name }</span></div>
        <div className="pointHand"><img className={ `point-${ getPointDirection().toLowerCase() }` }
                                        src="/point-hand.svg"
                                        alt="point hand"/></div>
        {

        }
        <button className="my-button">
        </button>
      </div>
    </>
  )

}

export default TakeOutTracker
