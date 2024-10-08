import { useEffect, useState } from 'react'

function OnlineStatus() {
  const [online, setOnline] = useState<boolean>(navigator.onLine)

  // Effect hook to add online/offline event listeners
  useEffect(() => {
    // Event listener for online status
    const handleOnline = () => {
      console.log('Became online');
      setOnline(true);
    };

    // Event listener for offline status
    const handleOffline = () => {
      console.log('Became offline');
      setOnline(false);
    };

    // Adding event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners on component unmount
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