import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>Einkaufsliste</h1>
      <nav>
        <div className="navContainer">
          <div className="navElement small"><Link to="/shopping-lists"><img src="/shopping-list-icon.svg"/></Link></div>
          <div className="navElement"><Link to="/staples"><img src="/stapler.svg"/></Link></div>
        </div>
      </nav>
    </>
  )
}

export default App
