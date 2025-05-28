import { RiBriefcaseLine, RiCollageLine, RiFile3Line, RiSettings2Line } from '@remixicon/react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const menuItem = [
    {label: 'Dashboard', icon: RiCollageLine, path: '/dashboard' },
    {label: 'Jobs', icon: RiBriefcaseLine, path: '/job/posts' },
    {label: 'Applications', icon: RiFile3Line, path: '/applications' },
    {label: 'Setting', icon: RiSettings2Line, path: '/setting' }
];

const RecruiterPannel = () => {
    const location = useLocation();

  return (
    <div className='bg-white w-56 h-screen flex flex-col justify-between'>
      <div>
        <div>
            <img className='w-40' src="/Logo.png" alt="" />
        </div>
        <div className='flex flex-col gap-4 pl-6'>
            {
                menuItem.map(({ label, icon: Icon, path}) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link to={path} key={label}>
                            <div className={`flex items-center gap-6 cursor-pointer text-md font-medium group ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                <Icon
                                size={22}
                                color='currentColor'
                                className={`duration-300 ${isActive ? 'text-[#0164FC]' : ''}`} 
                                />
                                <span className={`duration-300 ${isActive ? 'text-neutral-900' : ''}`}>
                                    {label}
                                </span>
                                <div className={`ml-auto w-0.5 h-6 duration-300 ${isActive ? 'bg-[#0164FC]' : 'bg-transparent'}`}/>
                            </div>
                        </Link>
                    )
                })
            }
            
      </div>
      </div>
      <div className='flex flex-col items-center gap-3 p-4'>
        <div className='bg-neutral-200 h-0.5 w-40 rounded-full'></div>
        <div className='flex gap-4 items-center p-2 px-5 hover:bg-neutral-100 hover:rounded-3xl'>
            <div>
                <img className='h-8 w-8 object-cover content-center rounded-full border-2 border-neutral-400' src="https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
            <div>
                <h5 className='text-sm font-medium text-neutral-600'>Ed Richards</h5>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterPannel
