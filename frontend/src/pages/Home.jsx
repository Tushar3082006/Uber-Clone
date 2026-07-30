import React, { useState, useRef, useContext, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import LiveTracking from '../components/LiveTracking'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ suggestions, setSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const panelRef = useRef(null)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)
    const navigate = useNavigate()

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
            params: { input: e.target.value },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setSuggestions(response.data)
    }

    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setFare(response.data)
    }

    async function createRide() {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup, destination, vehicleType
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
    }

    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, { height: '70%', padding: 24 })
        } else {
            gsap.to(panelRef.current, { height: '0%', padding: 0 })
        }
    }, [ panelOpen ])

    // Similar useGSAP hooks for vehiclePanelRef, confirmRidePanelRef, etc. [7-10]

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5 z-10' src="uber-logo.png" alt="" />
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form onSubmit={(e) => { e.preventDefault() }}>
                        <input onClick={() => { setPanelOpen(true); setActiveField('pickup') }} 
                               value={pickup} onChange={handlePickupChange}
                               className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5' type="text" placeholder='Add a pick-up location' />
                        <input onClick={() => { setPanelOpen(true); setActiveField('destination') }} 
                               value={destination} onChange={(e) => setDestination(e.target.value)}
                               className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3' type="text" placeholder='Enter your destination' />
                    </form>
                    <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg w-full mt-3'>Find Trip</button>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel suggestions={suggestions} setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} setPickup={setPickup} setDestination={setDestination} activeField={activeField} />
                </div>
            </div>
            {/* Conditional Panels */}
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
                <WaitingForDriver ride={ride} setWaitingForDriver={setWaitingForDriver} />
            </div>
        </div>
    )
}

export default Home