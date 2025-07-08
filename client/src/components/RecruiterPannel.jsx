import React, { useState } from 'react';
import {
  RiBriefcaseLine,
  RiCollageLine,
  RiFile3Line,
  RiSettings2Line,
  RiSparkling2Fill,
  RiMenuLine,
  RiCloseLine,
} from '@remixicon/react';
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <RiSparkling2Fill size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            CareerHunt
          </h1>
        </Link>
        <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300 cursor-pointer">
          {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
        </button>
      </div>

      {/* Sidebar drawer (responsive) */}
      <div
        className={`fixed sm:static top-0 left-0 h-full w-56 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 shadow-md sm:translate-x-0 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-neutral-800">
            <Link to="/dashboard" className="flex items-center gap-2 select-non cursor-pointere">
              <RiSparkling2Fill size={26} className="text-blue-600" />
              <h1 className="text-2xl font-semibold tracking-wide pt-1 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                CareerHunt
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 px-4 mt-4 flex-grow">
            {menuItem.map(({ label, icon: Icon, path }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link to={path} key={label} onClick={closeMenu}>
                  <div
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition relative
                      ${isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold dark:bg-blue-900 dark:text-white'
                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'}`}>
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

          {/* Footer profile */}
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-4 border-t border-gray-200 dark:border-neutral-800">
            <div className="flex gap-4 items-center p-2 w-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition rounded-3xl cursor-pointer">
              <img
                className="h-9 w-9 object-cover rounded-full ring-2 ring-gray-300 dark:ring-neutral-600"
                src={user?.profilePic || '/Recruiter.png'}
                alt={user?.name || 'User'}
              />
              <div className="truncate">
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize truncate">
                  {user?.name}
                </h5>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Backdrop for mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={closeMenu}>
        </div>
      )}
    </>
  );
};

export default RecruiterPannel;
