import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.tsx'
import ShoppingLists from './pages/shopping-lists.tsx'
import PrivateRoute from './routing/private-route.tsx'
import EditList from './pages/edit-list.tsx'
import Layout from './elements/layout.tsx'
import { AuthProvider } from './services/auth-provider.tsx'
import EditStaples from './pages/edit-staples.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>


    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <App/>
              </PrivateRoute>
            }/>
            <Route path="/login" element={
              <Login/>
            }/>
            <Route path="/shopping-lists" element={
              <PrivateRoute>
                <ShoppingLists/>
              </PrivateRoute>
            }/>
            <Route path="/shopping-lists/:listId" element={
              <PrivateRoute>
                <EditList/>
              </PrivateRoute>
            }/>
            <Route path="/staples" element={
              <PrivateRoute>
                <EditStaples/>
              </PrivateRoute>
            }/>
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>
)
