import { useState } from 'react'
import '../styles/takeout-tracker.scss'

const names = [
  'Max',
  'Yang',
  'Johann',
  'Blubdibub',
]

const TakeOutTracker = () => {
  const [ isSpinning, setIsSpinning ] = useState(false)
  const [ currentNameIndex, setCurrentNameIndex ] = useState(0)


  const segmentAngle = 360 / names.length

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const newName = currentNameIndex + 1
    setCurrentNameIndex(newName)

    setTimeout(() => {
      setIsSpinning(false)
    }, 1000) // Match this with the CSS transition duration
  }

  return (
    <div>
      <div>
        {/* Center pointer */ }
        <div className="pointer"/>

        {/* Wheel */ }
        <ul
          className="circle"
          style={ {
            transform: `rotate(${ currentNameIndex * segmentAngle }deg)`,
          } }
        >
          { names.map((name, index) => (
            <li
              key={ name }
              style={ {
                transform: `rotate(${ index * segmentAngle - segmentAngle /2 }deg) skewY(${ -(90 - segmentAngle) }deg)`,
              } }
            >
              <div
                className='text'
                style={ {
                 transform: `rotate(${ segmentAngle / 2 }deg)`,
                } }
              >{ name }
              </div>
            </li>
          )) }
        </ul>
      </div>

      <button
        onClick={ spinWheel }
        disabled={ isSpinning }
        className="spin-button"
      >
        Spin the Wheel
      </button>

    </div>
  )

}

export default TakeOutTracker

