import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import { RiArrowRightSLine } from '@remixicon/react'
import api from '../api/axios';
import { Link } from 'react-router-dom';
import RecruiterSearch from '../components/RecruiterSearch';

const Applications = () => {
    const [ jobs, setJobs ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/job-posts/all');
                console.log(response.data)
                setJobs(response.data.jobPosts);
            } catch (error) {
                console.error(error.response?.data || error.message);
            }
        }
        fetchData();
    }, [])
    

  return (
    <div className='w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden'>
      <RecruiterPannel />
    <div className='flex-1'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-bold py-8'>Applications</h2>
          <CurrentDate />
        </div>
        <RecruiterSearch />
        

        <div className='flex items-center justify-around  overflow-hidden transition-all ease-in duration-300'>
            <div className='w-4xl max-h-72 bg-white rounded-xl overflow-y-auto'>
                {jobs.map((job, index) => (
                    <Link to='/applications/applicants' key={index} className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                        <h4 className='text-md font-medium text-gray-800'>{job.title}</h4>
                        <RiArrowRightSLine className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black' size={25} />
                    </Link>
                ) )}
            </div>
        </div>        
        </div>
    </div>
  )
}

export default Applications
