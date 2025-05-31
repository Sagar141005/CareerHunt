import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import RecruiterSearch from '../components/RecruiterSearch'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { MoonLoader } from 'react-spinners'
import { useAuth } from '../context/AuthContext'

const Applicants = () => {

    const { user, loading } = useAuth();

    const [ applicants, setApplicants ] = useState([]);
    const [ loader, setLoader ] = useState(true);
    const { jobId } = useParams();

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
                const response = await api.get(`/job-posts/applications/${jobId}`);
                setApplicants(response.data.applications);
            } catch (error) {
                console.error(error.response?.data || error.message);
            } finally {
                setLoader(false);
            }
        }

    fetchData();
    }, [jobId]);

    if(loading) {
        return <p>Loading...</p>
    }

  return (
    <div className='w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden'>
      <RecruiterPannel />
      <div className='flex-1'>
        <div className='flex items-baseline justify-between'>
          <h2 className='text-xl font-bold py-8'>Applicants</h2>
          <CurrentDate />
        </div>

        <div className='flex items-center justify-around mb-6'>
            <h3 className='text-md font-medium text-neutral-600'>New applicants for <span className='font-semibold'>Front End Developer</span></h3>
        </div>

        <RecruiterSearch />

        <div className='flex items-center justify-center px-4'>
            <div className='w-4xl max-h-96 bg-white rounded-xl shadow-sm overflow-y-auto'>
                {loader ? (
                    <div className='flex h-96 items-center justify-around'>
                        <MoonLoader color='#63b3ed' size={35} />
                    </div>
                ) : (
                    applicants.map((applicant, index) => {
                        <Link 
                        to={`/applications/applicant/${applicant._id}`}
                        key={index}
                        className='flex items-center gap-4 px-6 py-4 hover:bg-neutral-100 transition-colors duration-200'>
                            <img 
                            className='h-10 w-10 object-cover rounded-full ring-1 ring-gray-400' 
                            src='https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
                            alt='Applicant' />
                            <div className='flex flex-col'>
                                <h4 className='text-gray-800 font-medium text-base'>{applicant.name}</h4>
                                <h5 className='text-sm text-gray-500'>View all applicant profiles</h5>
                            </div>
                        </Link>
                    })
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Applicants
