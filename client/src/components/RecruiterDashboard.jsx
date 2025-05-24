import React from 'react'
import HomeNavbar from './HomeNavbar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const capitalisedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className='bg-[#F8F9FA]'>
      <HomeNavbar />
      <div className='h-auto w-full px-8'>
        <div className='pt-60'>
            <h1 className='text-8xl text-[#1A1C1F] font-bold'>👋 Welcome { capitalisedName }!</h1>
            <h2 className='text-2xl text-[#1A1C1F] font-bold'>You have <span className='text-[#0164FC]'>12</span> applicants this week</h2>
        </div>
        <div className='pt-40 flex flex-col items-center gap-8'>
            <h3 className='text-4xl text-[#1A1C1F] font-bold'>Got a role to fill? Let’s get it live</h3>
            <button className='bg-black text-white font-bold p-4 px-6 rounded-xl'>Post a New Job</button>
        </div>
        <div>
            <h3 className='text-2xl text-[#1A1C1F] font-semibold'>Your Job Listings</h3>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default RecruiterDashboard
