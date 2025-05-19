import React from 'react'

const JobPost = () => {
  return (
    <div className='w-sm bg-white rounded-2xl shadow-lg hover:shadow-2xl p-4'> 
      <h2 className='text-xl font-bold'>Backend Developer</h2>
      <div className='mb-2'>
        <p className='text-lg text-[#474D6A]'>Created at: 10-11-24</p>
        <div className='flex items-center gap-4'>
            <p className='text-lg text-[#474D6A] gap-4 flex items-center'>Applicants: <span className='text-blue-700 font-semibold -ml-3'>12</span> <span className='w-0.5 h-5 bg-[#474D6A] inline-block'></span></p>
            <p className='text-lg text-[#474D6A]'>Status: <span className='text-green-600 font-semibold'>Open</span></p>
        </div>
      </div>
      <div className='flex items-center gap-8'>
        <button className='text-md p-3 px-5 bg-black rounded-xl text-white'>View Candidates</button>
        <button className='text-md p-3 px-5 bg-blue-700 rounded-xl text-white'>Edit Job</button>
      </div>
    </div>
  )
}

export default JobPost
