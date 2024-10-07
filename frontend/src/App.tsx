import { Link } from 'react-router-dom'

function App() {

  return (
    <>
      <h1>Einkaufsliste</h1>
      <nav>
        <ul>
          <li><Link to="/shopping-lists">Einkaufslisten</Link></li>
          <li><Link to="/staples">Staples</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default App
