import { changePassword, logout } from '../api/api.ts'
import { useAuth } from '../services/auth-provider.tsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { isAxiosError } from 'axios'

const AccountSettings = () => {
  const { authStatus, setAuthStatus } = useAuth()

  const [ currentPassword, setCurrentPassword ] = useState<string>('')
  const [ newPassword, setNewPassword ] = useState<string>('')
  const [ passwordConfirm, setPasswordConfirm ] = useState<string>('')
  const [ errorMessages, setErrorMessages ] = useState<string[]>([])
  const [ successMessages, setSuccessMessages ] = useState<string[]>([])

  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    setAuthStatus({ authenticated: false })
    navigate('/login')
  }

  const onChangePasswordClick = async () => {
    if (!validate()) {
      return
    }
    try {
      await changePassword(currentPassword, newPassword)
      setSuccessMessages(['Passwort erfolgreich geändert'])
    } catch (error: any) {
      if (isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            setErrorMessages([ 'Aktuelles Passwort ungültig' ])
            break
          default:
            setErrorMessages([ 'Es ist ein Fehler aufgetreten' ])
        }
      } else {
        setErrorMessages([ 'Es ist ein Fehler aufgetreten' ])
      }
    }
  }

  const validate = (): boolean => {
    const messages: string[] = []
    let valid = true
    if (!currentPassword) {
      messages.push('Aktuelles passwort darf nicht leer sein')
      valid = false
    }
    if (!newPassword) {
      messages.push('Neues Passwort darf nicht leer sein')
      valid = false
    }
    if (newPassword !== passwordConfirm) {
      messages.push('Passwörter stimmen nicht überein')
      valid = false
    }
    setErrorMessages(messages)
    return valid
  }

  return <>
    <h2>Account</h2>
    <div className="accountUserInfo">
      <p>angemeldet als <span className="userName">{ authStatus?.username }</span></p>
      <button className="my-button" onClick={ handleLogout }>abmelden</button>
    </div>
    <form className="loginForm" onSubmit={ e => e.preventDefault() }>
      <h3>Passwort ändern</h3>
      <label htmlFor="currentPassword">Aktuelles Passwort:</label>
      <input id="currentPassword" type="password" value={ currentPassword }
             onChange={ (e) => setCurrentPassword(e.target.value) }/>
      <label htmlFor="password">Neues Passwort:</label>
      <input id="password" type="password" value={ newPassword }
             onChange={ (e) => setNewPassword(e.target.value) }/>
      <label htmlFor="passwordConfirm">Passwort Bestätigen:</label>
      <input id="passwordConfirm" type="password" value={ passwordConfirm }
             onChange={ (e) => setPasswordConfirm(e.target.value) }/>
      <button className="my-button loginButton" type="submit" onClick={ onChangePasswordClick }>Ändern</button>
    </form>

    <div className="feedbackMessagesContainer">
      <div className="errorMessages">
        { errorMessages.map((message, index) => (<span key={ index }>{ message }</span>)) }
      </div>
      <div className="successMessages">
        { successMessages.map((message, index) => (<span key={ index }>{ message }</span>)) }
      </div>
    </div>

  </>

}

export default AccountSettings
