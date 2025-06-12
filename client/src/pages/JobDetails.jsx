import React, { useEffect, useState } from 'react'
import UserNavbar from '../components/UserNavbar'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios'
import { RiBriefcase2Line, RiBuildingLine, RiMapPinLine } from '@remixicon/react';

const JobDetails = () => {
    const { state } = useLocation();
    const { id } = useParams();

    const [ job, setJob ] = useState(state?.job || null);
    const [ loading, setLoading ] = useState(!state?.job);
    const navigate = useNavigate();

    useEffect(() => {
        if (job) return;
    
        const fetchJob = async () => {
          try {
            const response = await api.get(`/applications/details/${id}`);
            setJob(response.data);
          } catch (err) {
            console.error("Error fetching job:", err);
          } finally {
            setLoading(false);
          }
        };
    
        fetchJob();
      }, [id, job]);
    
      if (loading || !job) return <div>Loading...</div>;

      const handleClick = async () => {
        try {
            const response = api.post(`/applications/${job._id}`);

            navigate('/my-applications');
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
      }


  return (
    <div className='w-full min-h-screen bg-[#F9F9F9] overflow-y-hidden'>
      <UserNavbar />
      <div className='w-full h-full px-12 py-8 flex flex-col gap-6'>
        <h2 className='text-4xl font-bold'>Job Details</h2>
        <div className=''>
            <div className='w-full h-52 bg-white rounded-xl shadow-md mb-4 p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <h2 className='text-2xl font-medium'>{job.title}</h2>
                            <p className='text-md text-neutral-900'>{job.company}</p>
                        </div>
                        <div>
                            <div className='flex items-center gap-8'>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-8 flex items-center gap-2'><RiBriefcase2Line className='mb-1' size={18} /> {job.experience || 'N/A'}</h5>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-8 flex items-center gap-2'><span className='text-sm'>$</span> {job.salary || 'Not Disclosed'}</h5>
                                <h5 className='text-md font-medium text-neutral-700  border-r-[2px] border-neutral-200 pr-8 flex items-center gap-2'><RiBuildingLine className='mb-1' size={18} /> {job.type || 'Work type not specified'}</h5>
                                <h5 className='text-md font-medium text-neutral-700 flex items-center gap-2'><RiMapPinLine className='mb-1' size={18} /> {job.location || 'Hiring office location not specified'}</h5>
                            </div>
                        </div>
                    </div>
                    <div className='w-20 h-20 rounded-lg bg-gray-300 ring-2 ring-[#F2F2F2] overflow-hidden'>
                        <img className='h-full w-full object-cover content-center' src="/Recruiter.jpg" alt="" />
                    </div>
                </div>
                <div className='w-full h-[1.5px] bg-neutral-300 mb-4'></div>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-6'>
                        <h5 className='text-md text-neutral-600 font-light'>Posted: <span className='text-black font-normal'>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span></h5>
                        <h5 className='text-md text-neutral-600 font-light'>Openings: <span className='text-black font-normal'>{job.openings || 'Not disclosed'}</span></h5>
                        <h5 className='text-md text-neutral-600 font-light'>Applicants: <span className='text-black font-normal'>{job.applicationCount || 0}</span></h5>
                    </div>
                    <div>
                        <button onClick={handleClick} className='bg-blue-600 text-white font-medium py-2 px-4 rounded-lg'>Apply with AI</button>
                    </div>
                </div>
            </div>
            <div className='w-full min-h-44 bg-white rounded-xl shadow-md p-6'>
                <h3 className='text-xl font-medium mb-4'>Job description</h3>
                <div className='text-md text-neutral-700 flex flex-col gap-4'>
                    <p>{job.description || 'No description provided.'}</p>
                    <div className='flex flex-col gap-1'>
                         <h6><span className='text-black font-semibold'>Level:</span> {job.level}</h6>
                        <h6><span className='text-black font-semibold'>Type:</span> {job.type}</h6>
                        <h6><span className='text-black font-semibold'>Department:</span> {job.department}</h6>
                        <h6><span className='text-black font-semibold'>Employment Type:</span> {job.employmentType}</h6>
                    </div>
                   
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetails
