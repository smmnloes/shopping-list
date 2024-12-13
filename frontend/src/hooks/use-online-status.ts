import { useEffect, useState } from 'react'
import { onlineStatus } from '../api/api'

const useOnlineStatus = () => {
  const [ isOnline, setIsOnline ] = useState<boolean>(true)

  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const response = await onlineStatus()
        setIsOnline(response.status === 200)
      } catch (error) {
        setIsOnline(false)
      }
    }

    checkOnlineStatus()

    const intervalId = setInterval(checkOnlineStatus, 5000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return isOnline
}

export default useOnlineStatus