import { useNavigate } from 'react-router-dom'
import { login } from '../api/api.ts'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../services/auth-provider.tsx'

function Login() {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ messages, setMessages ] = useState<string[]>([])
  const navigate = useNavigate()
  const { setAuthStatus } = useAuth()

  const onClick = async () => {
    try {
      const authStatus = await login(username, password)
      setAuthStatus(authStatus)
      navigate('/')
    } catch (error: any) {
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            setMessages([ 'Ungültiges Passwort' ])
            break
          default:
            setMessages([ 'Es ist ein Fehler aufgetreten' ])
        }
      } else {
        setMessages([ 'Es ist ein Fehler aufgetreten' ])
      }
    }
  }


  return (
    <>
      <h2>Anmeldung</h2>
        <form className="loginForm" onSubmit={ e => e.preventDefault() }>
          <label htmlFor="userName">Nutzername:</label>
          <input id="userName" type="text" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
          <label htmlFor="password">Passwort:</label>
          <input id="password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>
          <button className="my-button loginButton" type="submit" onClick={ onClick }>Anmelden</button>
          <button className="my-button loginButton" onClick={ () => navigate('/register') }>Registrieren</button>
        </form>

        <div className="feedbackMessagesContainer">
          { messages.map((message, index) => (<span key={ index }>{ message }</span>)) }
        </div>
    </>
  )
}

export default Login
