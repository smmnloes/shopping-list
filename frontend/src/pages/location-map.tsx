import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { icon, LatLngTuple } from 'leaflet'
import { useState } from 'react'

const carIcon = icon({
  iconUrl: 'car.png',
  iconSize: [ 83, 50 ],
  iconAnchor: [ 41, 25 ]
})

const LocationMap = () => {
  const [ location, setLocation ] = useState<LatLngTuple>()

  const setLocationHandler = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      setLocation([ location.coords.latitude, location.coords.longitude ])
    }, (error) => console.error(error.message))
  }

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
          <Marker position={ location } icon={ carIcon }/>) }
      </MapContainer>
      <button onClick={ setLocationHandler } className="my-button">Standort setzen</button>
    </div>
  )
}

export default LocationMap
