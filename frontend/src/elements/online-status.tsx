import { useEffect, useState } from 'react'

function OnlineStatus() {
  const [online, setOnline] = useState(typeof window !== "undefined" ? window.navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return (
    <>
      <p>{online ? 'online': 'offline'}</p>
    </>
  )
}



export default OnlineStatus