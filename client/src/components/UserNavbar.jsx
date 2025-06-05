import { RiBardFill, RiMapPinLine, RiSettings2Line } from '@remixicon/react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const UserNavbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Find Job', path: '/jobs' },
    { name: 'Saved', path: '/saved' },
    { name: 'My Job', path: '/my-jobs' },
  ];

  return (
    <div className="relative">
      <div className="w-full h-20 bg-[#141414] text-white flex justify-between items-center py-2 px-6">
        <div className="flex items-center gap-16">
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <RiBardFill size={25} />
            <h1 className="text-2xl font-medium pt-1">CareerHunt</h1>
          </div>
          <div className="flex items-center justify-center gap-8 relative">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path)
              return (
              <Link key={link.name} to={link.path} className="relative">
                <h3 className={`text-md font-light ${isActive ? "text-white" : "text-neutral-300" }`}>
                  {link.name}
                </h3>
                {isActive && (
                  <div className="absolute bottom-[-31px] left-1/2 transform -translate-x-1/2 w-10 h-[1px] bg-white rounded" />
                )}
              </Link>
            )})}
          </div>
        </div>
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-1">
            <RiMapPinLine size={15} />
            <h3 className="text-sm text-neutral-100 font-light pt-1">
              New York, NY
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center">
              <img
                className="w-full h-full rounded-full object-contain"
                src="./Recruiter.jpg"
                alt=""
              />
            </div>
            <div className="h-9 w-9 border border-[#555455] text-neutral-200 rounded-full overflow-hidden flex items-center justify-center">
              <RiSettings2Line size={18} color="currentColor" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#555455]" />
    </div>
  );
};

export default UserNavbar;
