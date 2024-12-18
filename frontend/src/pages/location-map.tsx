import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { icon } from 'leaflet'
import { useEffect, useState } from 'react'
import { getLocation, postLocation } from '../api/locations.ts'
import type { LocationFrontendView } from '../../../shared/types/location.ts'

const carIcon = icon({
  iconUrl: 'car.png',
  iconSize: [ 83, 50 ],
  iconAnchor: [ 41, 25 ]
})

const LocationMap = () => {
  const [ location, setLocation ] = useState<LocationFrontendView>()

  const setLocationHandler = async () => {
    navigator.geolocation.getCurrentPosition(async (location) => {
      console.log(location)
      const newLocation = await postLocation(location.coords.latitude, location.coords.longitude, 'CAR')
      setLocation(newLocation)
    }, (error) => console.error(error.message))
  }

  useEffect(() => {
    (async () => {
      try {
        const location = await getLocation('CAR')
        setLocation(location)
        console.log(location)
      } catch (e: any) {
        console.error(e.message)
      }
    })()
  }, [])

  return (
    <div className="mapcontainer">
      <MapContainer center={ [
        52.425379, 13.329916
      ] } zoom={ 18 } maxZoom={ 18 } scrollWheelZoom={ true } touchZoom={ true }>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { location && (
          <Marker position={ { lat: location.lat, lng: location.lng } } icon={ carIcon }/>) }
      </MapContainer>
      <button onClick={ setLocationHandler } className="my-button">Standort setzen</button>
    </div>
  )
}

export default LocationMap
