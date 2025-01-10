import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { onlineStatus } from '../api/api.ts'


const OnlineStatusContext = createContext<boolean>(true)

export const OnlineStatusProvider = ({ children }: { children: ReactNode }) => {
  const [ isOnline, setIsOnline ] = useState<boolean>(true)

  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const response = await onlineStatus()
        setIsOnline(response.status === 200)
      } catch (e) {
        setIsOnline(false)
      }
    }

    checkOnlineStatus()

    const intervalId = setInterval(checkOnlineStatus, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <OnlineStatusContext.Provider value={
      isOnline
    }>
      { children }
    </OnlineStatusContext.Provider>
  )
}

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext)
  if (context === undefined) {
    throw new Error('useOnlineStatus must be used within an OnlineStatusProvider')
  }
  return context
}
