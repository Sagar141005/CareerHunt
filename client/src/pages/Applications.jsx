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
      <div className='flex-1 flex flex-col'>
        <div className='flex items-baseline justify-between pr-8 py-6'>
          <h2 className='text-2xl font-extrabold text-gray-900'>Applications</h2>
          <CurrentDate />
        </div>

        <div className='px-8 py-4'>
          <RecruiterSearch />
        </div>

        <div className='flex justify-center px-8 flex-grow'>
          <div 
            className='w-full max-w-4xl max-h-96 bg-white rounded-xl shadow-md overflow-y-auto'
            >
            {loader ? (
              <div className='flex h-96 items-center justify-center'>
                <MoonLoader color='#3B82F6' size={40} />
              </div>
            ) : (
              jobs.length > 0 ? jobs.map((job, index) => (
                <Link
                  to={`/applications/applicants/${job._id}`}
                  state={{ title: job.title }}
                  key={job._id}
                  className='group flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 rounded-lg cursor-pointer'>
                  <div className='flex flex-col'>
                    <h4 className='text-lg font-semibold text-gray-800'>{job.title}</h4>
                    <p className='text-sm text-gray-500 mt-1'>{job.location || 'Location not specified'}</p>
                  </div>

                  <RiArrowRightSLine 
                    className='text-blue-300 group-hover:text-blue-700 transition-colors duration-200' 
                    size={28} />
                </Link>
              )) : (
                <div className='text-center py-20 text-gray-400 font-medium'>No job posts available</div>
              )
            )}
          </div>
        </div>        
      </div>
    </div>
  )
}

export default Applications;
