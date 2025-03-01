import { changePassword, insult, logout } from '../api/api.ts'
import { useAuth } from '../providers/auth-provider.tsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { subscribeToPushNotifications } from '../serviceworker/push-notifications.ts'
import { getNotificationsStatus, setNotificationsStatus, testNotification } from '../api/notifications.ts'
import { StoredSubscription } from '../../../shared/types/push-notifications'
import Slideout from '../elements/slideout.tsx'
import '../styles/account-settings.scss'

const AccountSettings = () => {
  const { authStatus, setAuthStatus } = useAuth()

  const [ currentPassword, setCurrentPassword ] = useState<string>('')
  const [ newPassword, setNewPassword ] = useState<string>('')
  const [ passwordConfirm, setPasswordConfirm ] = useState<string>('')
  const [ errorMessages, setErrorMessages ] = useState<string[]>([])
  const [ successMessages, setSuccessMessages ] = useState<string[]>([])
  const [ notificationsEnabled, setNotificationsEnabled ] = useState<boolean | undefined>()
  const [ pushSubscriptionActive, setPushSubscriptionActive ] = useState<boolean | undefined>()

  const navigate = useNavigate()

  useEffect(() => {
    refresh()
  }, [])

  const refresh = async () => {
    const { enabled, storedSubscription } = await getNotificationsStatus()
    setNotificationsEnabled(enabled)
    setPushSubscriptionActive(await isSubscriptionActive(storedSubscription))
  }

  const isSubscriptionActive = async (storedSubscription: StoredSubscription): Promise<boolean> => {
    return await navigator.serviceWorker?.getRegistration().then(registration => registration?.pushManager.getSubscription()
      .then(currentSubscription =>
        currentSubscription?.endpoint === storedSubscription.endpoint
        && (currentSubscription?.expirationTime == null || currentSubscription.expirationTime < Date.now())
      )) ?? false
  }

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
      setSuccessMessages([ 'Passwort erfolgreich geändert' ])
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

  const handleNotificationToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    await setNotificationsStatus(newValue)
    if (newValue) {
      await subscribeToPushNotifications()
    }
    await refresh()
  }

  return <>
    <div className="accountSettingsContainer">
      <div className="accountUserInfo">
        <p>angemeldet als<br/><span className="userName">{ authStatus?.username }</span></p>
        <button className="my-button accountPageButton" onClick={ handleLogout }>abmelden</button>
      </div>


      <Slideout title="Benachrichtigungen">
        <div className="notificationsContainer">
          { (notificationsEnabled !== undefined) && (<div className="notificationToggleContainer">
            <span>Aus</span>
            <label className="switch">
              <input type="checkbox" checked={ notificationsEnabled } onChange={ handleNotificationToggle }/>
              <span className="slider round"></span>
            </label>
            <span>An</span>
          </div>) }
          <div
            className={ `notificationHealthIndicator ${ pushSubscriptionActive ? 'healthy' : 'unhealthy' } ${ !notificationsEnabled ? 'hidden' : '' }` }>
            <div className="notificationStatusAndIcon">
              <span>Status:</span>
              <img
                src={ pushSubscriptionActive ? '/checkmark-circle.svg' : '/alert.svg' } alt="ok"/>
            </div>
          </div>
          <button className="my-button testbutton"
                  onClick={ testNotification }>Test!
          </button>
          <button className="my-button" onClick={insult}>!$%#</button>
        </div>
      </Slideout>

      <Slideout title="Passwort ändern">
        <>
          <form className="loginForm" onSubmit={ e => e.preventDefault() }>
            <label htmlFor="currentPassword">Aktuelles Passwort:</label>
            <input id="currentPassword" type="password" value={ currentPassword }
                   onChange={ (e) => setCurrentPassword(e.target.value) }/>
            <label htmlFor="password">Neues Passwort:</label>
            <input id="password" type="password" value={ newPassword }
                   onChange={ (e) => setNewPassword(e.target.value) }/>
            <label htmlFor="passwordConfirm">Passwort Bestätigen:</label>
            <input id="passwordConfirm" type="password" value={ passwordConfirm }
                   onChange={ (e) => setPasswordConfirm(e.target.value) }/>
            <button className="my-button accountPageButton" type="submit" onClick={ onChangePasswordClick }>ändern
            </button>
          </form>

          <div className="feedbackMessagesContainer">
            <div className="errorMessages">
              { errorMessages.map((message, index) => (<div key={ index }>{ message }</div>)) }
            </div>
            <div className="successMessages">
              { successMessages.map((message, index) => (<div key={ index }>{ message }</div>)) }
            </div>
          </div>
        </>
      </Slideout>
    </div>
  </>

}

export default AccountSettings
