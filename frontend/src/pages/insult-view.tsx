import '../styles/insults.scss'
import { CSSProperties } from 'react'


const InsultView = () => {

  const params = new URLSearchParams(location.search)
  const insult = params.get('insult')
  const nrOfAnimations = 5
  const singleLetterAnimations = [ 4, 5 ]
  const randomAnimation = Math.floor(Math.random() * nrOfAnimations + 1)

  const randomRGB = Math.floor(Math.random() * 3)

  return (<>
      <div className="insult-view-wrapper">
        <div
          className={ `insult-view text-animation-${ randomAnimation }` }>
          { singleLetterAnimations.includes(randomAnimation)
            ? insult?.split('').map((char, index) => <span key={ index }
                                                           style={ {
                                                             '--index': index,
                                                             '--randomR': randomRGB === 0 ? 1 : 0,
                                                             '--randomG': randomRGB === 1 ? 1 : 0,
                                                             '--randomB': randomRGB === 2 ? 1 : 0,
                                                             '--randomVal': Math.random()
                                                           } as CSSProperties }>{ char }</span>)
            : insult }
        </div>
      </div>
    </>
  )

}

export default InsultView