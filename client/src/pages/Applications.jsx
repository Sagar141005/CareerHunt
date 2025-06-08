import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import { RiArrowRightSLine } from '@remixicon/react'
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterSearch from '../components/RecruiterSearch';
import { MoonLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';

const Applications = () => {
    const { user, loading } = useAuth();

    const [ jobs, setJobs ] = useState([]);
    const [ loader, setLoader ] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);


    useEffect(() => {
        if (user && user.role !== 'recruiter') {
          navigate('/dashboard');
          console.error("Not Authenticated");
        }
      }, [user, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/job-posts/all');
                setJobs(response.data.jobPosts);
            } catch (error) {
                console.error(error.response?.data || error.message);
            } finally {
                setLoader(false);
            }
        }
        fetchData();
    }, [])
    
    if(loading) {
        return <p>Loading...</p>
    }

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
            <div className='w-4xl max-h-96 bg-white rounded-xl overflow-y-auto'>
                {loader ? (
                    <div className='flex h-96 items-center justify-center'>
                        <MoonLoader color='#63b3ed' size={35} />
                    </div>
                ) : (
                    jobs.map((job, index) => (
                        <Link
                        to={`/applications/applicants/${job._id}`}
                        state={{ title: job.title }}
                        key={index}
                        className='px-8 py-3 rounded-xl hover:bg-neutral-200 hover:cursor-pointer flex items-center justify-between group'>
                            <h4 className='text-md font-medium text-gray-800'>{job.title}</h4>
                            <RiArrowRightSLine
                            className='bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-neutral-300 group-hover:text-black'
                            size={25}/>
                        </Link>
                    ))
                )}
            </div>
        </div>        
    </div>
    </div>
  )
}

export default Applications
