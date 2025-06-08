import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import api from '../api/axios'
import JobCard from '../components/JobCard';

const Saved = () => {
    const [ jobs, setJobs ] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/applications/saved/all');
                setJobs(response.data.jobs);

            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        }
    
        fetchJobs();
    }, [])
    
  return (
    <div className='w-full min-h-screen bg-[##F9F9F9] overflow-y-hidden'>
      <UserNavbar />
      <div className='w-full h-full px-12 py-8 flex flex-col gap-6'>
        <div className='flex justify-between items-baseline'>
            <h2 className='text-4xl font-bold'>Saved Jobs</h2>
            <p className='text-sm text-neutral-500'>Sort by: <span className='text-black'>Most recent</span></p>
        </div>
        <div className='w-full flex items-center gap-4 flex-wrap'>
                    {jobs?.length > 0 ? (
                        jobs.map((job) => <JobCard key={job._id} job={job} />)
                    ) : (
                        <p className="text-lg text-gray-500 mt-8">No jobs available right now. Check back soon!</p>
                    )}
                </div>
      </div>
    </div>
  )
}

export default Saved
