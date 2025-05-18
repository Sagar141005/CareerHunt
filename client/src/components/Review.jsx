import React from 'react'
import { RiStarFill } from '@remixicon/react'

const Review = ({ rating, text, name, role, image }) => {
  return (
    <div className='bg-white h-60 w-2xl rounded-xl flex flex-col justify-between px-4'>
      <div className='flex items-center mt-4 text-amber-300'>
        {[...Array.from({ length: rating }, (_, idx) => (
            <RiStarFill key={idx} size={20} color='currentColor'/>
        ))]}
      </div>
      <p>{text}</p>
      <div className='flex items-center gap-3 mb-4'>
        <img className='h-10 w-10 rounded-full size-fit' src={image} alt="" />
        <div>
            <h3 className='text-[#1A1C1F] font-bold text-lg'>{name}</h3>
            <h3 className='text-[#1A1C1F] font-light text-md'>{role}</h3>
        </div>
      </div>
    </div>
  )
}

export default Review
