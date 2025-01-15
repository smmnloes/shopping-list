import '../styles/takeout-tracker.scss'
import { useState } from 'react'

type PointDirection = 'LEFT' | 'RIGHT'

const TakeOutTracker = () => {
  const [ pointDirection, setPointDirection ] = useState<PointDirection>()

  return (
    <div className="takeoutTracker">
      <div className="takeoutNames"><span>Name 1</span><span>Name 2</span></div>
      <div className="pointHand"><img className={ `point-${ pointDirection?.toLowerCase() ?? 'up' }` } src="/point-hand.svg"
                                      alt="point hand"/></div>
      <button className="my-button"
              onClick={ () => setPointDirection((prev) => prev === 'LEFT' ? 'RIGHT' : 'LEFT') }>Ich habe bezahlt!
      </button>
    </div>
  )

}

export default TakeOutTracker
