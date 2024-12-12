import { useNavigate } from 'react-router-dom'
import { register } from '../api/api.ts'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { useAuth } from '../services/auth-provider.tsx'

function Register() {
  const [ registrationSecret, setRegistrationSecret ] = useState('')
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordConfirm, setPasswordConfirm ] = useState('')
  const [ message, setMessage ] = useState('')
  const navigate = useNavigate()
  const {setAuthStatus} = useAuth()

  const onClick = async () => {
    try {
      const authStatus = await register({credentials: {username, password}, registrationSecret})
      setAuthStatus(authStatus)
      navigate('/')
    } catch (error: unknown) {
      console.log((error as AxiosError).message)
      setMessage('Fehler')
    }
  }


  return (
    <>
      <h1>Registrierung</h1>
      <div className="content">
        <form className="loginForm" onSubmit={ e => e.preventDefault() }>
          <label htmlFor="registrationSecret">Registrierungspassword:</label>
          <input id="registrationSecret" type="password" value={ registrationSecret } onChange={ (e) => setRegistrationSecret(e.target.value) }/>
          <label htmlFor="userName">Nutzername:</label>
          <input id="userName" type="text" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
          <label htmlFor="password">Passwort:</label>
          <input id="password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>
          <label htmlFor="passwordConfirm">Passwort Bestätigen:</label>
          <input id="passwordConfirm" type="password" value={ passwordConfirm }
                 onChange={ (e) => setPasswordConfirm(e.target.value) }/>
          <button className="my-button loginButton" type="submit" onClick={ onClick }>Registrieren</button>
        </form>

        { message && <p>{ message }</p> }
      </div>
    </>
  )
}

export default Register
