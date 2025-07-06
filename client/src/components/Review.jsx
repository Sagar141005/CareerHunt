import React from 'react'
import { RiStarFill } from '@remixicon/react'

const Review = ({ rating, text, name, role, image }) => {
  return (
    <div className='bg-white lg:h-60 h-48 lg:w-2xl w-md rounded-xl flex flex-col justify-between px-4'>
      <div className='flex items-center lg:mt-8 mt-4 text-amber-300'>
        {[...Array.from({ length: rating }, (_, idx) => (
          <RiStarFill
            key={idx}
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"/>
        ))]}
      </div>
      <p className='lg:text-base text-sm'>{text}</p>
      <div className='flex items-center gap-3 mb-4'>
        <img className='h-10 w-10 rounded-full size-fit' src={image} alt="" />
        <div>
            <h3 className='text-[#1A1C1F] font-bold lg:text-lg text-md'>{name}</h3>
            <h3 className='text-[#1A1C1F] font-light lg:text-md text-sm'>{role}</h3>
        </div>
      </div>
    </div>
  )
}

export default Review
