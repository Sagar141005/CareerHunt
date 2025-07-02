import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';


const Profile = () => {
  const { user, loading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);



    if(loading) {
        return <p>Loading...</p>
    }


  return (
    <div className='w-full min-h-screen bg-[#F2F2F2] flex flex-col justify-between'>
        <div>
            <div className='relative  pb-28'>
                <img className='h-64 w-full' src='/Bg-graadient.png' alt="" />
                <Link 
                to='/dashboard'
                className='absolute flex items-center justify-center h-12 w-12 rounded-full bg-white top-4 left-4 shadow-lg cursor-pointer text-[#ccc] hover:text-black  transition-all duration-200'>
                    <RiArrowLeftLine size={30} color='currentColor' />
                </Link>
                
                <div className='absolute w-50 h-50 rounded-full bg-gray-300 top-36 left-8 ring-8 ring-[#F2F2F2] overflow-hidden'>
                    <img className='h-full w-full object-cover content-center' src={user.profilePic || '/Recruiter.jpg'} alt={user.name} />
                </div>
            </div>
            <div className='flex justify-between'>
                <div className='ml-8'>
                    <h1 className='text-4xl font-bold capitalize'>{user.name}</h1>
                    <h3 className='text-xl text-neutral-600'>{user.designation}</h3>
                    <h3 className='text-xl text-neutral-500'>{user.location ? user.location : ''}</h3>
                    <h4 className='text-lg'>{user.bio ? user.bio : ''}</h4>
                    <div className='flex items-center gap-6 mt-4'>
                        <Link to='/profile/edit' className='bg-black text-white py-3 px-8 rounded-full text-lg font-medium border-2 border-black cursor-pointer hover:text-black hover:bg-transparent transition-all duration-200'>Edit Profile</Link>
                        <Link to='/setting' className='py-3 px-8 rounded-full text-lg font-medium border-2 border-black cursor-pointer hover:text-white hover:bg-black transition-all duration-200'>Settings</Link>
                    </div>
                </div>

                <div className='mr-20'>
                    {user.role === 'recruiter' && user.company && (
                        <>
                            <h3 className='text-xl font-medium'>Company</h3>
                            <div className='flex items-start gap-6'>
                                {user.company.logoUrl && (
                                    <img className='w-20 h-20 rounded-lg object-cover' src={user.company.logoUrl} alt="Company Logo" />
                                )}
                                <div>
                                    <h4 className='text-xl font-semibold'>{user.company.name}</h4>
                                    <p className='text-sm text-neutral-600'>{user.company.location}</p>
                                    {user.company.website && (
                                        <a className="text-blue-600 text-sm" href={user.company.website} target="_blank" rel="noreferrer">
                                            {user.company.website}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        {user.role === 'recruiter' ? (
            <div className='mx-8 mt-8 pb-4 flex items-center gap-6'>
                <Link 
                to={'/post/job'}
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>Post a Job</h4>
                        <p>Create and publish new job listings to find the right talent quickly for your open roles.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end pr-6'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
                <Link
                to={'/applications'} 
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>View Applicants</h4>
                        <p>Review applications, filter top candidates, and manage your hiring pipeline with ease.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
                <Link 
                to={'/profile/edit'}
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>Update</h4>
                        <p>Edit your company details, and recruiter info to keep your profile up to date and relevant.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
            </div>
        ) : (
            <div className='mx-8 mt-8 pb-4 flex items-center gap-6'>
                <Link 
                to={'/jobs'}
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>Find Your Dream Job</h4>
                        <p>Browse and apply to top job opportunities that match your skills and goals.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end pr-6'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
                <Link
                to={'/resume'}
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>Get hired with AI</h4>
                        <p>Let AI help optimize your resume and stand out to potential employers.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
                <Link 
                to={'/profile/edit'}
                className='w-1/3 h-44 bg-blue-100 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200'>
                    <div>
                        <h4 className='text-2xl font-[600] pb-4'>Update</h4>
                        <p>Keep your profile updated so that recruiters know you better.</p>
                    </div>
                    <div className='w-1/3 flex flex-col justify-center items-end'>
                        <RiArrowRightLine className=' text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600  transition-all duration-300 shadow-sm' size={40} color='currentColor'  />
                    </div>
                </Link>
            </div>
        )}  
    </div>
  )
}

export default Profile
