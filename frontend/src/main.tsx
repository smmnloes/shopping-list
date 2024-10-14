import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.tsx'
import PrivateRoute from './routing/private-route.tsx'
import EditLists from './pages/edit-lists.tsx'
import Layout from './elements/layout.tsx'
import { AuthProvider } from './services/auth-provider.tsx'
import EditStaples from './pages/edit-staples.tsx'
import './main.css'
import MealPlan from './pages/meal-plan.tsx'

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
            <Route path="/edit-lists" element={
              <PrivateRoute>
                <EditLists/>
              </PrivateRoute>
            }/>
            <Route path="/staples" element={
              <PrivateRoute>
                <EditStaples/>
              </PrivateRoute>
            }/>
            <Route path="/meal-plan" element={
              <PrivateRoute>
                <MealPlan/>
              </PrivateRoute>
            }/>
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>
)
