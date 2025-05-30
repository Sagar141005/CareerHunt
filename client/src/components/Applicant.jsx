import React from 'react'

const Applicant = () => {
  return (
    <div className='flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-100'>
      <div>
        <img className='h-10 w-10 object-cover content-center rounded-full' src="https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
      <div className=''>
        <h4 className='text-md font-medium text-gray-800'>Douglas Roy</h4>
        <p className='text-sm font-light text-neutral-500'>Applied for <span className='text-neutral-600'>iOS Developer</span></p>
      </div>
    </div>
  )
}

export default Applicant
