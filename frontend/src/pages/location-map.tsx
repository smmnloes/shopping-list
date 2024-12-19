import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { DragEndEvent, icon, Marker as LeafletMarker } from 'leaflet'
import { useEffect, useState } from 'react'
import { getLocation, postLocation } from '../api/locations.ts'
import type { LocationFrontendView } from '../../../shared/types/location.ts'
import { formatDate } from '../utils/date-time-format.ts'

const carIcon = icon({
  iconUrl: 'car.png',
  iconSize: [ 83, 50 ],
  iconAnchor: [ 40, 50 ], // sets the anchor to the middle bottom of the car
  popupAnchor: [0, -55]   // sets the popup slightly above the middle of the car
})

const LocationMap = () => {
  const [ location, setLocation ] = useState<LocationFrontendView>()

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

  const setLocationHandler = async () => {
    navigator.geolocation.getCurrentPosition(async (location) => {
      const newLocation = await postLocation(location.coords.latitude, location.coords.longitude, 'CAR')
      setLocation(newLocation)
    }, (error) => console.error(error.message))
  }

  const markerChangeHandler = async (e: DragEndEvent) => {
    const newLatLng = (e.target as LeafletMarker).getLatLng()
    const newLocation = await postLocation(newLatLng.lat, newLatLng.lng, 'CAR')
    setLocation(newLocation)
  }

  return (
    <div className="mapcontainer">
      <MapContainer center={ [
        52.425379, 13.329916
      ] } zoom={ 18 } maxZoom={ 18 } scrollWheelZoom={ true } touchZoom={ true } zoomControl={ false }>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { location && (
          <Marker position={ { lat: location.lat, lng: location.lng } } icon={ carIcon } draggable={ true }
                  eventHandlers={ { dragend: markerChangeHandler } }><Popup>von <b>{ location.createdByName }</b><br/>am <b>{ formatDate(new Date(location.createdAt)) }</b>
          </Popup></Marker>) }
      </MapContainer>
      <button onClick={ setLocationHandler } className="my-button">Auf aktuellen Standort setzen</button>
    </div>
  )
}

export default LocationMap
