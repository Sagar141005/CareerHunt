import React from 'react'
import { formatDistanceToNow } from "date-fns";
import { Link } from 'react-router-dom';

const JobPost = ({ job }) => {

  const isOpen = (deadline) => {
    const now = new Date();
    const jobDeadline = new Date(deadline);
    return jobDeadline >= now;
  }


  return (
    <div className='w-70 h-64 bg-white rounded-xl flex flex-col gap-4 p-4'>
      <div className='h-10 w-9 border border-neutral-300 rounded-full flex items-center justify-center'>
        <img className='object-cover content-center' src={job.companyLogo} alt="" />
      </div>
      <div className='flex items-baseline gap-2'>
        <h5 className='text-md'>{job.company}</h5>
        <p className='text-xs text-neutral-400'>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
      </div>
      <div>
        <h2 className='text-xl font-semibold text-black'>{job.title}</h2>
        <div className='flex gap-2'>
          <h4 className='text-xs font-light bg-neutral-200 py-2 px-3 rounded-lg w-fit'>{job.type}</h4>
          <h4 className='text-xs font-light bg-neutral-200 py-2 px-3 rounded-lg w-fit'>{isOpen ? "Open" : "Closed"}</h4>
        </div>
      </div>
      <div className='h-0.5 w-full bg-neutral-100'></div>
      <div className='flex justify-between'>
        <button className='text-white font-medium bg-[#010101] py-2 px-4 rounded-lg'>Edit</button>
        <Link 
        to={`/applications/applicants/${job._id}`}
        className='text-white font-medium bg-blue-600 py-2 px-4 rounded-lg'>
          View Applicants
        </Link>
      </div>
    </div>
  )
}

export default JobPost
