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
        <div className="navElement">
          <Link to="/locations"><img src="/parking.svg" alt="notes"/>
          </Link>
          <span>Autostandort</span>
        </div>
        <div className="navElement">
          <Link to="/takeout-tracker"><img src="/take-away.svg" alt="notes"/>
          </Link>
          <span>Takeout</span>
        </div>
        <div className="navElement">
          <Link to="/files"><img src="/take-away.svg" alt="files"/>
          </Link>
          <span>Files</span>
        </div>
      </div>
    </>
  )
}

export default App
