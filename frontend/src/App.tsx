import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>Einkaufsliste</h1>
      <nav>
        <div className="navContainer">
          <div className="navElement small"><Link to="/edit-lists"><img src="/shopping-list-icon.svg" alt="einkaufsliste"/></Link></div>
          <div className="navElement"><Link to="/meal-plan"><img src="/meal.svg" alt="meal-plan"/></Link></div>
          <div className="navElement"><Link to="/notes"><img src="/notebook.svg" alt="notes"/></Link></div>
        </div>
      </nav>
    </>
  )
}

export default App
