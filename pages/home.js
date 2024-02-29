// pages/index.js
import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const Map = () => {
  const [weatherData, setWeatherData] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 35.6895, lng: 139.6917 })
  const [markerPosition, setMarkerPosition] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    if (markerPosition) {
      getWeatherData(markerPosition.lat, markerPosition.lng)
    }
  }, [markerPosition])

  const getWeatherData = async (lat, lng) => {
    try {
      const apiKeyWeather = 'e850122e9cfa2aaaf04a97ebcec1ba3c'
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKeyWeather}&units=metric`
      )
      const data = await response.json()
      setWeatherData(data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  const handleSearch = async () => {
    try {
      const apiKeyMaps = 'AIzaSyCAEJZfy1FEphiwUELubnqORxVEAMxlgcE'
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${searchInput}&key=${apiKeyMaps}`
      )
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location
        setMarkerPosition({ lat: location.lat, lng: location.lng })
        setMapCenter({ lat: location.lat, lng: location.lng })
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error)
    }
  }

  return (
    <LoadScript googleMapsApiKey='AIzaSyCAEJZfy1FEphiwUELubnqORxVEAMxlgcE'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <div style={{ height: '50%', width: '100%' }}>
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            zoom={10}
            center={mapCenter}
            onClick={e => {
              setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() })
              setMapCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
        {weatherData && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h2>天気情報</h2>
            <p>場所: {weatherData.name}</p>
            <p>気温: {weatherData.main.temp} °C</p>
          </div>
        )}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <input
            type='text'
            placeholder='場所を検索'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <button onClick={handleSearch}>検索</button>
        </div>
      </div>
    </LoadScript>
  )
}

export default Map
