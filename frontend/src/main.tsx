import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login.tsx'
import PrivateRoute from './routing/private-route.tsx'
import EditLists from './pages/edit-lists.tsx'
import Layout from './elements/layout.tsx'
import { AuthProvider } from './providers/auth-provider.tsx'
import EditStaples from './pages/edit-staples.tsx'
import './styles/main.scss'
import './styles/spinner.scss'
import './styles/toggle-switch.scss'
import 'leaflet/dist/leaflet.css'
import MealPlan from './pages/meal-plan.tsx'
import Notes from './pages/notes.tsx'
import { EditNote } from './pages/edit-note.tsx'
import Register from './pages/register.tsx'
import LocationMap from './pages/location-map.tsx'
import AccountSettings from './pages/account-settings.tsx'
import { OnlineStatusProvider } from './providers/online-status-provider.tsx'
import TakeOutTracker from './pages/take-out-tracker.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <OnlineStatusProvider>
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
              <Route path="/register" element={
                <Register/>
              }/>
              <Route path="/locations" element={
                <PrivateRoute>
                  <LocationMap/>
                </PrivateRoute>
              }/>
              <Route path="/account" element={
                <PrivateRoute>
                  <AccountSettings/>
                </PrivateRoute>
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
              <Route path="/notes" element={
                <PrivateRoute>
                  <Notes/>
                </PrivateRoute>
              }/>
              <Route path="/notes/:id" element={
                <PrivateRoute>
                  <EditNote/>
                </PrivateRoute>
              }/>
              <Route path="/takeout-tracker" element={
                <PrivateRoute>
                  <TakeOutTracker/>
                </PrivateRoute>
              }/>
            </Routes>
          </Layout>
        </AuthProvider>
      </OnlineStatusProvider>
    </BrowserRouter>
  </StrictMode>
)
