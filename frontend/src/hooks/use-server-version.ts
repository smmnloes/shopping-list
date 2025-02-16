import { useEffect, useState } from 'react'
import { getServerVersion } from '../api/api'

const useServerVersion = () => {
  const [ serverVersion, setServerVersion ] = useState<{ version: string } | undefined>()

  useEffect(() => {
    const checkVersion = async () => {
      const serverVersion = await getServerVersion().catch(() => console.log('Could not get server version'))
      if (serverVersion) {
        setServerVersion({ version: serverVersion })
      }
    }

    checkVersion()
    const intervalId = setInterval(checkVersion, 60000)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return serverVersion
}

export default useServerVersion