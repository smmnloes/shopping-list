import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './pages/login.tsx'
import RootWrapper from './routing/root-wrapper.tsx'
import EditLists from './pages/edit-lists.tsx'
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
import TakeOutTracker from './pages/take-out-tracker.tsx'


const router = createBrowserRouter(
  createRoutesFromElements([
      <Route path="/" element={
        <RootWrapper privateRoute={ true }>
          <App/>
        </RootWrapper>
      }/>,
      <Route path="/login" element={
        <RootWrapper privateRoute={ false }>
          <Login/>
        </RootWrapper>
      }/>,
      <Route path="/register" element={
        <RootWrapper privateRoute={ false }>
          <Register/>
        </RootWrapper>
      }/>,
      <Route path="/locations" element={
        <RootWrapper privateRoute={ true }>
          <LocationMap/>
        </RootWrapper>
      }/>,
      <Route path="/account" element={
        <RootWrapper privateRoute={ true }>
          <AccountSettings/>
        </RootWrapper>
      }/>,
      <Route path="/edit-lists" element={
        <RootWrapper privateRoute={ true }>
          <EditLists/>
        </RootWrapper>
      }/>,
      <Route path="/staples" element={
        <RootWrapper privateRoute={ true }>
          <EditStaples/>
        </RootWrapper>
      }/>,
      <Route path="/meal-plan" element={
        <RootWrapper privateRoute={ true }>
          <MealPlan/>
        </RootWrapper>
      }/>,
      <Route path="/notes" element={
        <RootWrapper privateRoute={ true }>
          <Notes/>
        </RootWrapper>
      }/>,
      <Route path="/notes/:id" element={
        <RootWrapper privateRoute={ true }>
          <EditNote/>
        </RootWrapper>
      }/>,
      <Route path="/takeout-tracker" element={
        <RootWrapper privateRoute={ true }>
          <TakeOutTracker/>
        </RootWrapper>
      }/>
    ]
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router }/>
  </StrictMode>
)


