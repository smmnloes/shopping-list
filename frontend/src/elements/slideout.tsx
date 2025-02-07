import { useState } from 'react'
import '../styles/slideout.scss'

const Slideout = ({ children, title }: { children: JSX.Element, title?: string }) => {

  const [ slideoutDown, setSlideoutDown ] = useState(false)
  const toggleSlideout = () => setSlideoutDown((prev) => !prev)

  return <div className="slideout">
    <div className="title">{title}</div>
    <div className={ `slideout-bar  ${ slideoutDown ? 'down' : '' }` } onClick={ toggleSlideout }>
      <img src="/triangle.svg" alt=""/>
      <div className="line"/>
    </div>
    <div className="slideout-container">
      <div className={ `slideout-content ${ slideoutDown ? 'down' : '' }` }>
        { children }
      </div>
    </div>
  </div>
}

export default Slideout