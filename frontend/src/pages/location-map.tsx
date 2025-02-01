import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { DragEndEvent, icon, Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import { createRef, Ref, useEffect, useState } from 'react'
import { getLocation, postLocation } from '../api/locations.ts'
import type { LocationFrontendView } from '../../../shared/types/location.ts'
import { formatDateAndTime } from '../utils/date-time-format.ts'

const carIcon = icon({
  iconUrl: 'car.png',
  iconSize: [ 83, 50 ],
  iconAnchor: [ 40, 50 ], // sets the anchor to the middle bottom of the car
  popupAnchor: [ 0, -55 ]   // sets the popup slightly above the middle of the car
})

const DEFAULT_LOCATION = { lat: 52.425379, lng: 13.329916 }

const LocationMap = () => {
  const [ location, setLocation ] = useState<LocationFrontendView>()
  let mapRef: Ref<LeafletMap> = createRef()

  useEffect(() => {
    (async () => {
      try {
        const location = await getLocation('CAR')
        setLocation(location)
      } catch (e: any) {
        console.error(e.message)
      }
    })()
  }, [])

  useEffect(() => {
    if (mapRef.current !== null && location) {
      mapRef.current.setView(location)
    }
  }, [ location, mapRef ])


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
      <MapContainer ref={ mapRef } center={ DEFAULT_LOCATION } zoom={ 18 } maxZoom={ 18 } scrollWheelZoom={ true }
                    touchZoom={ true } zoomControl={ false }>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        { location && (
          <Marker position={ { lat: location.lat, lng: location.lng } } icon={ carIcon } draggable={ true }
                  eventHandlers={ { dragend: markerChangeHandler } }><Popup>von <b>{ location.createdByName }</b><br/>am <b>{ formatDateAndTime(new Date(location.createdAt)) }</b>
          </Popup></Marker>) }
      </MapContainer>
      <button onClick={ setLocationHandler } className="my-button">Auf aktuellen Standort setzen</button>
    </div>
  )
}

export default LocationMap
