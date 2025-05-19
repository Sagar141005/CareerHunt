import React from 'react'
import HomeNavbar from '../components/HomeNavbar'
import { RiSearchLine } from '@remixicon/react'
import Footer from '../components/Footer'

const UserDashboard = () => {
  return (
    <div className='bg-[#F8F9FA]'>
      <HomeNavbar />
      <div className='h-auto w-full px-8'>
        <div className='pt-60'>
            <h1 className='text-8xl text-[#1A1C1F] font-bold'>Hello, Sagar 👋</h1>
            <p className='text-2xl text-[#0164FC] font-bold'>Stay focused!</p>
        </div>
        <div className='pt-40 flex flex-col items-center gap-8'>
            <h3 className='text-4xl text-[#1A1C1F] font-bold'>Find your dream job now</h3>
            <div className='flex items-center justify-center gap-3'>
            <input className='bg-white rounded-2xl w-xl h-10 text-base p-4' type="search" placeholder='Search jobs here' />
            <button><RiSearchLine size={20} color='currentColor' /></button>
            </div>
        </div>
        <div className='pt-20'>
            <h3 className='text-2xl text-[#1A1C1F] font-semibold'>Jobs you may be interested in</h3>
            <div>

            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserDashboard
