import React, { useState } from 'react'
import { RiBookmarkLine, RiBookmarkFill } from '@remixicon/react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';


const JobCard = ({ job }) => {
  const [ saved, setSaved ] = useState(false);

  const handleClick = () => {
    return setSaved(!saved);
  }

  return (
    <div className='w-64 h-72 bg-white rounded-xl flex flex-col justify-between p-4'>
      <div className='flex items-center justify-between'>
        <div className='h-10 w-10 bg-white border border-neutral-300 rounded-full overflow-hidden flex items-center justify-center'>
          <img className='w-9 h-9 rounded-full object-contain' src={job.companyLogo} alt="" />
        </div>
        <button 
          onClick={handleClick}
          className={`text-sm flex gap-0.5 items-center cursor-pointer hover:text-[#0164FC]
                    ${saved ? 'text-[#0164FC]' : 'text-[#474D6A]'}`}>
            {saved === false ?
              (<><RiBookmarkLine size={15} color='currentColor'/>Save</> ) : 
              (<><RiBookmarkFill size={15} color='currentColor'/>Saved</> )
            }
        </button> 
      </div>
      <div className='flex flex-col gap-2'>
          <div className='flex items-baseline gap-2'>
            <h5 className='text-md'>{job.company}</h5>
            <p className='text-xs text-neutral-400'>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
          </div>
        <div>
          <h2 className='text-xl font-semibold text-black'>{job.title}</h2>
          <div className='flex flex-wrap gap-2'>
            <h4 className='text-xs font-light bg-neutral-200 py-2 px-3 rounded-lg w-fit'>{job.type}</h4>
            <h4 className='text-xs font-light bg-neutral-200 py-2 px-3 rounded-lg w-fit'>{job.level}</h4>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='h-0.5 w-full bg-neutral-100'></div>
        <div className='flex justify-between'>
          <button>Details</button>
          <Link
            to={`/jobs/${job._id}`}
            className='text-white font-medium bg-black py-2 px-4 rounded-lg'>
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard