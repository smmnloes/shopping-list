import  { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login.tsx'
import ShoppingLists from './pages/shopping-lists.tsx'
import PrivateRoute from './routing/private-route.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
  },{
    path: '/login',
    element: <Login />,
  },{
    path: '/shopping-lists',
    element: (
      <PrivateRoute>
        <ShoppingLists />
      </PrivateRoute>
    ),
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router }/>
  </StrictMode>
)
