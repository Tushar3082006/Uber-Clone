import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const containerStyle = { width: '100%', height: '100%' }

const LiveTracking = () => {
    const [ currentPosition, setCurrentPosition ] = useState({ lat: -3.745, lng: -38.523 })

    const updatePosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords
            setCurrentPosition({ lat: latitude, lng: longitude })
        })
    }

    useEffect(() => {
        updatePosition()
        const interval = setInterval(updatePosition, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={currentPosition} zoom={15}>
                <Marker position={currentPosition} />
            </GoogleMap>
        </LoadScript>
    )
}

export default LiveTracking