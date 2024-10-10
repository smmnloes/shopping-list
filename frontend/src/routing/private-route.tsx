import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../services/auth-provider.tsx'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { authStatus } = useAuth();

  useEffect(() => {
    if (authStatus && !authStatus.authenticated) {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  if (authStatus === null) {
    return <div>Loading...</div>;
  }

  if (!authStatus.authenticated) {
    return null;
  }

  return children;
}

export default PrivateRoute