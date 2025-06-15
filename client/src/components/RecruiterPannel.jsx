import {
    RiBriefcaseLine,
    RiCollageLine,
    RiFile3Line,
    RiSettings2Line,
    RiSparkling2Fill,
  } from '@remixicon/react';
  import React from 'react';
  import { Link, useLocation } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';
  
  const menuItem = [
    { label: 'Dashboard', icon: RiCollageLine, path: '/dashboard' },
    { label: 'Jobs', icon: RiBriefcaseLine, path: '/job/posts' },
    { label: 'Applications', icon: RiFile3Line, path: '/applications' },
    { label: 'Setting', icon: RiSettings2Line, path: '/setting' },
  ];
  
  const RecruiterPannel = () => {
    const { user } = useAuth();
    const location = useLocation();
  
    return (
      <div className="bg-white w-56 h-screen flex flex-col border-r border-gray-100 shadow-sm">
        
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-2 select-none">
            <RiSparkling2Fill size={26} className="text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 pt-1">CareerHunt</h1>
          </Link>
        </div>
  
        <nav className="flex flex-col gap-1 px-4 mt-4 flex-grow">
          {menuItem.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link to={path} key={label}>
                <div
                  className={`
                    group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition relative
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'}
                  `}>
                  <Icon size={20} className="shrink-0" />
                  <span className="text-sm">{label}</span>
  
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-600 rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
  
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-4 select-none border-t border-gray-200">
            <div className='flex gap-4 items-center p-2 w-70 px-5 hover:bg-neutral-100 transition rounded-3xl'>
                <img
                className="h-9 w-9 object-cover rounded-full ring-2 ring-gray-300"
                src={user?.profilePic || '/Recruiter.png'}
                alt={user?.name || 'User'}/>
                <div className="truncate">
                    <h5 className="text-sm font-semibold text-gray-700 truncate capitalize">
                    {user?.name}
                    </h5>
                </div>
            </div>
          
        </Link>
      </div>
    );
  };
  
  export default RecruiterPannel;
  