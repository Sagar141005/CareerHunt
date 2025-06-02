import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';

const RecruiterProfile = () => {

    const { user, loading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);


    useEffect(() => {
        if (user && user.role !== 'recruiter') {
          navigate('/dashboard');
          console.error("Not Authenticated");
        }
      }, [user, navigate]);

      if(loading) {
        return <p>Loading...</p>
    }


  return (
    <div className='w-full h-screen bg-[#F2F2F2]'>
        <div className='relative  pb-28'>
            <img className='h-64 w-full' src='./Bg-graadient.png' alt="" />
            <Link 
            to='/dashboard'
            className='absolute flex items-center justify-center h-12 w-12 rounded-full bg-white top-4 left-4 shadow-lg cursor-pointer text-[#ccc] hover:text-black  transition-all duration-200'>
                <RiArrowLeftLine size={30} color='currentColor' />
            </Link>
            
            <div className='absolute w-50 h-50 rounded-full bg-gray-300 top-36 left-8 ring-8 ring-[#F2F2F2] overflow-hidden'>
                <img className='h-full w-full object-cover content-center' src="./Recruiter.jpg" alt="" />
            </div>
        </div>
        <div className='ml-8'>
            <h1 className='text-4xl font-bold'>{user.name}</h1>
            <h3 className='text-xl text-neutral-500'>Recruiter</h3>
            <h3 className='text-xl text-neutral-500'>Los Angeles, California</h3>
            <div className='flex items-center gap-6 mt-4'>
                <button className='bg-black text-white py-3 px-8 rounded-full text-lg font-medium border-2 border-black cursor-pointer hover:text-black hover:bg-transparent transition-all duration-200'>Edit Profile</button>
                <button className='py-3 px-8 rounded-full text-lg font-medium border-2 border-black cursor-pointer hover:text-white hover:bg-black transition-all duration-200'>Settings</button>
            </div>
        </div>
        <div className='mx-8 mt-8 flex items-center gap-6'>
            <div className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                <div>
                    <h4 className='text-2xl font-[600] pb-4'>Post a Job</h4>
                    <p>Create and publish new job listings to find the right talent quickly for your open roles.</p>
                </div>
                <div className='w-1/3 flex flex-col justify-center items-end pr-6'>
                    <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                </div>
            </div>
            <div className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                <div>
                    <h4 className='text-2xl font-[600] pb-4'>View Applicants</h4>
                    <p>Review applications, filter top candidates, and manage your hiring pipeline with ease.</p>
                </div>
                <div className='w-1/3 flex flex-col justify-center items-end'>
                    <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                </div>
            </div>
            <div className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                <div>
                    <h4 className='text-2xl font-[600] pb-4'>Update</h4>
                    <p>Edit your company details, and recruiter info to keep your profile up to date and relevant.</p>
                </div>
                <div className='w-1/3 flex flex-col justify-center items-end'>
                    <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default RecruiterProfile
