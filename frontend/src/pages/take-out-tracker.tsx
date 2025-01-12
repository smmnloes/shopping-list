import { CSSProperties, useState } from 'react'
import '../styles/takeout-tracker.scss'

const names = [
  'Max',
  'Yang',
]

const TakeOutTracker = () => {
  const [ isSpinning, setIsSpinning ] = useState(false)
  const [ currentRotation, setCurrentRotation ] = useState(0)

  const getSelectedName = names[currentRotation % names.length]

  const segmentAngle = 360 / names.length

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setCurrentRotation((currentRotation + 1))

    setTimeout(() => {
      setIsSpinning(false)
    }, 1000) // Match this with the CSS transition duration
  }

  return (
    <div>
      <div className="pie" style={ { '--n': names.length, transform: `rotate(${currentRotation * segmentAngle * -1}deg)` } as CSSProperties }>
        <div className="centerCircle"/>
        { names.map((name, index) => (
          <div className="slice" key={ index }
               style={ {
                 '--i': index,
                 '--c': index % 2 === 0 ? '#4f6880' : '#abc8e3',
                 '--x': `"${ name }"`,
                 '--oa': `${ (-90)}deg`
               } as CSSProperties }></div>
        )) }
      </div>
      <button onClick={spinWheel}>Spin wheel</button>
      <div>{`Selected name is: ${getSelectedName}`}</div>
    </div>
  )

}

export default TakeOutTracker
