import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const isTokenValid = (token: string) => {
  try {
    const decodedToken: any = jwtDecode(token)
    return decodedToken.exp * 1000 > Date.now()
  } catch (error) {
    console.error(error)
    return false
  }
}

const PrivateRoute = ({children}: { children: JSX.Element }) => {
  const token = Cookies.get('jwt')

  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login"/>
  }

  return children
}

export default PrivateRoute