import { RiFacebookBoxFill, RiInstagramFill, RiLinkedinBoxFill, RiTwitterXFill } from '@remixicon/react'
import React from 'react'

const Footer = () => {
  return (
    <div className='bg-[#F8F9FA] h-auto w-full flex flex-col'>
      <div className=' flex justify-between items-center  p-8'>
        <div className='flex flex-col flex-3 px-4 items-start gap-4'>
        <img className='h-80' src="/Logo.png" alt="" />
        <div>
            <h3>Empowering job seekers and recruiters with smart tools like</h3>
            <h3>resume checks, job tracking, and easy job posting.</h3>
        </div>
        <div>
            <div className='flex w-60 justify-between items-center'>
                <a href='https://www.twitter.com/' target='_blank' rel='noopener noreferrer'>
                    <RiTwitterXFill size={30} color='black' />
                </a>
                <a href='https://www.instagram.com/' target='_blank' rel='noopener noreferrer'>
                    <RiInstagramFill size={30} color='#F10184' />
                </a>
                <a href='https://www.facebook.com/' target='_blank' rel='noopener noreferrer'>
                    <RiFacebookBoxFill size={30} color='#0765FF' />
                </a>
                <a href='https://www.linkedin.com/' target='_blank' rel='noopener noreferrer'>
                    <RiLinkedinBoxFill size={30} color='#0B65C2' />
                </a>
            </div>
        </div>
        </div>
        <div className='flex flex-col flex-2 px-4'>
        <h3 className='text-[#1A1C1F] font-bold text-lg'>For Job Seekers</h3>
        <div>
            <p className='font-light text-md '>Apply for Jobs</p>
            <p className='font-light text-md '>Resume Analyser</p>
            <p className='font-light text-md '>Tracker</p>
        </div>
        </div>
        <div className='flex flex-col flex-1 px-4'>
        <h3 className='text-[#1A1C1F] font-bold text-lg'>For Recruiters</h3>
        <div>
            <p className='font-light text-md '>Post a Job</p>
            <p className='font-light text-md '>Manage Jobs</p>
        </div>
        </div>
      </div>
      <div>
        <div className='flex items-center gap-10 justify-center'>
          <p>About Us</p>
          <p>Privacy Policy</p>
          <p>Terms & Conditions</p>
        </div>
        <div className='flex items-center justify-center'>
          <p>© 2025 Career Hunt Inc • All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
