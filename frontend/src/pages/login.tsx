import { useNavigate } from 'react-router-dom'
import { login } from '../api/api.ts'
import { useState } from 'react'
import { AxiosError } from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const onClick = async () => {
    try {
      await login(username, password)
      navigate('/')
    } catch (error: unknown) {
      console.log((error as AxiosError).message)
      setMessage('Ungültiges Passwort!')
    }
  }


  return (
    <>
      <h1>Login Page</h1>
      <div className="card">
        <label htmlFor="userName">Benutzername:</label>
        <input id="userName" type="text" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
        <label htmlFor="password">Passwort:</label>
        <input id="password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>
        <button type="submit" onClick={ onClick }>Anmelden</button>
        { message && <p>{ message }</p> }
      </div>
    </>
  )
}

export default Login
