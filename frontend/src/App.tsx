import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <div className="navContainer">
        <div className="navElement small">
          <Link to="/edit-lists"><img src="/shopping-list-icon.svg"
                                      alt="einkaufsliste"/>
          </Link>
          <span>Einkaufsliste</span>
        </div>

        <div className="navElement">
          <Link to="/meal-plan"><img src="/meal.svg" alt="meal-plan"/>
          </Link>
          <span>Meal Plan</span>
        </div>
        <div className="navElement">
          <Link to="/notes"><img src="/notebook.svg" alt="notes"/>
          </Link>
          <span>Notizen</span>
        </div>
      </div>
    </>
  )
}

export default App
