import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './pages/login.tsx'
import RootWrapper from './routing/root-wrapper.tsx'
import EditLists from './pages/edit-lists.tsx'
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
import Shares from './pages/shares.tsx'
import EditShare from './pages/edit-share.tsx'
import SharesPublic from './pages/shares-public.tsx'
import InsultView from './pages/insult-view.tsx'
import BabyNames from './pages/baby-names.tsx'
import BabyNamesMatches from './pages/baby-names-matches.tsx'


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
      }/>,
      <Route path="/shares" element={
        <RootWrapper privateRoute={ true }>
          <Shares/>
        </RootWrapper>
      }/>,
      <Route path="/shares/:shareId" element={
        <RootWrapper privateRoute={ true }>
          <EditShare/>
        </RootWrapper>
      }/>,
      <Route path="/insult-view" element={
        <RootWrapper privateRoute={ true }>
          <InsultView/>
        </RootWrapper>
      }/>,

      <Route path="/shares-public/:shareCode" element={
        <RootWrapper privateRoute={ false }>
          <SharesPublic/>
        </RootWrapper>
      }/>,
    <Route path="/baby-names" element={
      <RootWrapper privateRoute={ true }>
        <BabyNames/>
      </RootWrapper>
    }/>,
    <Route path="/baby-names/matches" element={
      <RootWrapper privateRoute={ true }>
        <BabyNamesMatches/>
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


