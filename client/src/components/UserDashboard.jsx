import React, { useEffect, useState } from 'react'
import { RiSearchLine } from '@remixicon/react'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import JobCard from './JobCard'
import api from '../api/axios'
import UserNavbar from './UserNavbar'

const UserDashboard = () => {
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const capitalisedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const [ jobs, setJobs ] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
        try {
            const response = await api.get('/applications/all');
            setJobs(response.data.jobs);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    fetchJobs();
}, [])

  return (
    <div className='bg-[#F8F9FA]'>
      <UserNavbar />
      <div className='h-auto w-full px-8'>
        <div className='pt-60'>
            <h1 className='text-8xl text-[#1A1C1F] font-bold'>Hi, { capitalisedName } 👋</h1>
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
            {jobs.length > 0 ? (
                jobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
                  <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
            )}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserDashboard
