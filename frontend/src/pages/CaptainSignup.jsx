import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainSignup = () => {
  const navigate = useNavigate()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')
  const { captain, setCaptain } = useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email, password,
      vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: vehicleCapacity, vehicleType }
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)
    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }
    setEmail(''); setFirstName(''); setLastName(''); setPassword('')
    setVehicleColor(''); setVehiclePlate(''); setVehicleCapacity(''); setVehicleType('')
  }

  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's our Captain's name</h3>
          <div className='flex gap-4 mb-7'>
            <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' type="text" placeholder='First name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' type="text" placeholder='Last name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
          <input required className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg' type="email" placeholder='email@example.com' value={email} onChange={(e) => setEmail(e.target.value)} />
          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input required className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg' type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' type="text" placeholder='Vehicle Color' value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
            <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' type="text" placeholder='Vehicle Plate' value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
          </div>
          <div className='flex gap-4 mb-7'>
            <input required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' type="number" placeholder='Vehicle Capacity' value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
            <select required className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg' value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>Create Captain Account</button>
        </form>
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </div>
      <div>
        <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.</p>
      </div>
    </div>
  )
}

export default CaptainSignup