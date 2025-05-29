import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import JobPost from '../components/JobPost'
import api from '../api/axios'
import { Link } from 'react-router-dom'

const JobPosts = () => {

    const [ jobs, setJobs ] = useState([]);


    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/job-posts/all');
                setJobs(response.data.jobPosts);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        }

        fetchJobs();
    }, [])

  return (
    <div className='w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden'>
      <RecruiterPannel />
      <div className='flex-1 overflow-y-auto'>
      <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-bold py-8'>Jobs</h2>
          <CurrentDate />
        </div>
        <div className='flex items-center justify-between mr-8 mb-4'>
            <h2 className='text-3xl font-light'>7 Active Jobs</h2>
            <Link to='/post/job' className='text-md p-3 px-5 bg-blue-700 rounded-xl text-white'>Add Job Post</Link>
        </div>
        <div className='flex flex-wrap gap-4'>
            {jobs.map((job) => (
                <JobPost key={job._id} job={job} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default JobPosts
