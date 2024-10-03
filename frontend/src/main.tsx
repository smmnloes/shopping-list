import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login.tsx'
import ShoppingLists from './pages/shopping-lists.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
  },{
    path: '/login',
    Component: Login,
  },{
    path: '/shopping-lists',
    Component: ShoppingLists,
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router }/>
  </StrictMode>
)
