import { useNavigate } from 'react-router-dom'
import { login } from '../api/api.ts'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { useAuth } from '../services/auth-provider.tsx'

function Login() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ message, setMessage ] = useState('')
  const navigate = useNavigate()
  const {setAuthStatus} = useAuth()

  const onClick = async () => {
    try {
      const authStatus = await login(username, password)
      setAuthStatus(authStatus)
      navigate('/')
    } catch (error: unknown) {
      console.log((error as AxiosError).message)
      setMessage('Ungültiges Passwort!')
    }
  }


  return (
    <>
      <h1>Anmeldung</h1>
      <div className="container">
        <form className="loginForm" onSubmit={ e => e.preventDefault() }>
          <label htmlFor="userName">Nutzername:</label>
          <input id="userName" type="text" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
          <label htmlFor="password">Passwort:</label>
          <input id="password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>
          <button className="loginButton" type="submit" onClick={ onClick }>Anmelden</button>
        </form>

        { message && <p>{ message }</p> }
      </div>
    </>
  )
}

export default Login
