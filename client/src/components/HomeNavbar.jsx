import { RiSearchLine } from '@remixicon/react'
import React from 'react'

const HomeNavbar = () => {
  return (
    <div className='h-20 bg-white mx-auto flex justify-between items-center rounded-4xl w-5xl'>
      <div className='ml-3 flex items-center'>
        <img src="/eer.png" className='rounded-4xl h-18' alt="" />
      </div>
      <div className='flex items-center gap-3'>
        <input className='bg-[#F8F9FA] rounded-2xl w-xl h-10 text-base p-4' type="search" placeholder='Search jobs here' />
        <button><RiSearchLine size={20} color='currentColor' /></button>
      </div>
      <div className='flex items-center gap-4 mr-4'>
        <button className='text-[#0164FC] font-bold '>LOG IN</button>
        <button className='bg-[#0164FC] text-white font-bold p-2 px-3 rounded-xl'>SIGN UP</button>
      </div>
    </div>
  )
}

export default HomeNavbar
