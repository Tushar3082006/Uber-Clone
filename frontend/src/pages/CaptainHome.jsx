import React, { useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveTracking from '../components/LiveTracking'

const CaptainHome = () => {
    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
    const [ ride, setRide ] = useState(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', { userId: captain._id, userType: 'captain' })

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: { ltd: position.coords.latitude, lng: position.coords.longitude }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()
        return () => clearInterval(locationInterval)
    }, [ captain, socket ])

    socket.on('new-ride', (data) => {
        setRide(data)
        setRidePopupPanel(true)
    })

    useGSAP(() => {
        if (ridePopupPanel) gsap.to(ridePopupPanelRef.current, { transform: 'translateY(0)' })
        else gsap.to(ridePopupPanelRef.current, { transform: 'translateY(100%)' })
    }, [ ridePopupPanel ])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
                <img className='w-16' src="uber-logo.png" alt="logo" />
                <Link to='/captain-login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'><LiveTracking /></div>
            <div className='h-2/5 p-6'><CaptainDetails /></div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp ride={ride} setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12 h-screen'>
                <ConfirmRidePopUp ride={ride} setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>
        </div>
    )
}

export default CaptainHome