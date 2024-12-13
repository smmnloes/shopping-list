import { useNavigate } from 'react-router-dom'
import { register } from '../api/api.ts'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useAuth } from '../services/auth-provider.tsx'

function Register() {
  const [ registrationSecret, setRegistrationSecret ] = useState('')
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passwordConfirm, setPasswordConfirm ] = useState('')
  const [ messages, setMessages ] = useState<string[]>([])
  const navigate = useNavigate()
  const { setAuthStatus } = useAuth()

  const onClick = async () => {
    if (!validate()) {
      return
    }
    try {
      const authStatus = await register({ credentials: { username, password }, registrationSecret })
      setAuthStatus(authStatus)
      navigate('/')
    } catch (error: any) {
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 409:
            setMessages([ 'Nutzername schon vergeben' ])
            break
          case 401:
            setMessages([ 'Registrierungspasswort inkorrekt' ])
            break
          default:
            setMessages([ 'Es ist ein Fehler aufgetreten' ])
        }
      } else {
        setMessages([ 'Es ist ein Fehler aufgetreten' ])
      }
    }
  }

  const validate = (): boolean => {
    const messages: string[] = []
    let valid = true
    if (!username) {
      messages.push('Nutzername darf nicht leer sein')
      valid = false
    }
    if (!password) {
      messages.push('Passwort darf nicht leer sein')
      valid = false
    }
    if (password !== passwordConfirm) {
      messages.push('Passwörter stimmen nicht überein')
      valid = false
    }
    setMessages(messages)
    return valid
  }


  return (
    <>
      <h2>Registrierung</h2>
      <div className="content">
        <form className="loginForm" onSubmit={ e => e.preventDefault() }>
          <label htmlFor="registrationSecret">Registrierungspassword:</label>
          <input id="registrationSecret" type="password" value={ registrationSecret }
                 onChange={ (e) => setRegistrationSecret(e.target.value) }/>
          <label htmlFor="userName">Nutzername:</label>
          <input id="userName" type="text" value={ username } onChange={ (e) => setUsername(e.target.value) }/>
          <label htmlFor="password">Passwort:</label>
          <input id="password" type="password" value={ password } onChange={ (e) => setPassword(e.target.value) }/>
          <label htmlFor="passwordConfirm">Passwort Bestätigen:</label>
          <input id="passwordConfirm" type="password" value={ passwordConfirm }
                 onChange={ (e) => setPasswordConfirm(e.target.value) }/>
          <button className="my-button loginButton" type="submit" onClick={ onClick }>Registrieren</button>
        </form>

        <div className="feedbackMessagesContainer">
          { messages.map((message, index) => (<span key={ index }>{ message }</span>)) }
        </div>
      </div>
    </>
  )
}

export default Register
