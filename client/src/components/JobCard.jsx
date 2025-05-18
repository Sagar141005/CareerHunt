import React, { useState } from 'react'
import { RiMapPinLine, RiBriefcaseLine, RiCalendarEventLine, RiBookmarkLine, RiBookmarkFill } from '@remixicon/react';


const JobCard = () => {
  const [ saved, setSaved ] = useState(false);

  const handleClick = () => {
    return setSaved(!saved);
  }

  function truncateTitle(title) {
    const words = title.trim().split(/\s+/);
    return words.length <= 2 ? title: `${words.slice(0, 2).join(' ')}...`
  }
  return (
    <>
    <div className='rounded-2xl bg-white w-2xs p-4 flex justify-between shadow mb-4 hover:shadow-xl'>
      <div>
        <h2 className='text-xl font-bold'>{truncateTitle("Full Stack Developer")}</h2>
        <p className='text-[#474D6A] font-semibold'>Google</p>
        <p className='text-[#474D6A] text-sm flex gap-1 items-center'><RiMapPinLine size={15} color='#474D6A'/> Delhi</p>
        <p className='text-[#474D6A] text-sm flex gap-1 items-center'><RiBriefcaseLine size={15} color='#474D6A' /> On-site</p>
        <p className='text-[#474D6A] text-sm flex gap-1 items-center'><RiCalendarEventLine size={15} color='#474D6A' /> 10-11-2023</p>
      </div>
      <div className='flex flex-col justify-between items-end'>
        <img className='h-12 w-fit rounded-xl' src="https://img.naukimg.com/logo_images/groups/v1/194354.gif" alt="" />
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
    </div>
    </>
  )
}

export default JobCard
