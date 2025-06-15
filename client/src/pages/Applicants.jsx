import React, { useEffect, useState } from 'react'
import RecruiterPannel from '../components/RecruiterPannel'
import CurrentDate from '../components/CurrentDate'
import RecruiterSearch from '../components/RecruiterSearch'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'
import { MoonLoader } from 'react-spinners'
import { useAuth } from '../context/AuthContext'

const Applicants = () => {

    const { user, loading } = useAuth();

    const [ applicants, setApplicants ] = useState([]);
    const [ loader, setLoader ] = useState(true);
    const { jobId } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const { title } = location.state || {};

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
            <h3 className='text-md font-medium text-neutral-600'>New applicants for <span className='font-semibold'>{title || "Job"}</span></h3>
        </div>

        <RecruiterSearch />

        <div className='flex items-center justify-center px-4'>
            <div className='w-4xl max-h-96 bg-white rounded-xl shadow-sm overflow-y-auto'>
                {loader ? (
                    <div className='flex h-96 items-center justify-around'>
                        <MoonLoader color='#63b3ed' size={35} />
                    </div>
                ) : (
                    applicants.map((applicant, index) => (
                        <Link 
                        to={`/applications/applicant/${applicant.userId._id}`}
                        key={index}
                        className='flex justify-between items-center px-6 py-4 hover:bg-neutral-100 transition-colors duration-200 rounded-lg'>
                            <div className='flex items-center gap-4'>
                                <img 
                                className='h-10 w-10 object-cover rounded-full ring-1 ring-gray-400' 
                                src={applicant.userId.profilePic || '/Recruiter.png'} 
                                alt='Applicant' />
                                <div className='flex flex-col'>
                                    <h4 className='text-gray-800 font-medium text-base'>
                                        {applicant.userId.name}
                                    </h4>
                                    <h5 className='text-sm text-gray-500 cursor-pointer hover:underline'>
                                        View full profile
                                    </h5>
                                </div>
                            </div>
                            {applicant.status && (
                                <span className={`text-xs px-3 py-1 rounded-full font-semibold 
                                ${applicant.status === 'Applied' ? 'bg-blue-100 text-[#3B82F6]' :
                                    applicant.status === 'Shortlisted' ? 'bg-green-100 text-[#22C55E]' :
                                    applicant.status === 'On-hold' ? 'bg-yellow-100 text-[#FACC15]' :
                                    applicant.status === 'Interview' ? 'bg-purple-100 text-[#8B5CF6]' :
                                    applicant.status === 'Hired' ? 'bg-orange-100 text-[#FB923C]' :
                                    applicant.status === 'Rejected' ? 'bg-red-100 text-[#FF6B6B]' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                {applicant.status}
                                </span>
                            )}
                        </Link>

                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Applicants
