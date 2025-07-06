import { RiMapPinLine, RiSettings2Line, RiSparkling2Fill, RiMenuLine, RiCloseLine } from '@remixicon/react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const UserNavbar = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  const navLinks = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Find Job', path: '/jobs' },
    { name: 'Saved', path: '/saved' },
    { name: 'Applications', path: '/my-applications' },
    { name: 'Resume', path: '/resume' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="relative">
      <div className="w-full h-20 bg-gradient-to-r from-sky-700 to-blue-700 dark:bg-[#141414] dark:bg-none text-white flex justify-between items-center py-2 px-6 shadow-sm transition-colors duration-300">
        
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Link
            to='/dashboard'
            className="flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Go to dashboard">
            <RiSparkling2Fill size={25} />
            <h1 className="text-2xl font-medium pt-1 text-white">CareerHunt</h1>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="relative group">
                <h3 className={`
                  group relative text-md font-light transition-colors
                  ${isActive(link.path)
                    ? "text-white font-medium"
                    : "text-blue-200 dark:text-neutral-300 group-hover:text-white"
                  }
                `}>
                  {link.name}
                </h3>
                {isActive(link.path) && (
                  <div className="absolute bottom-[-29px] left-1/2 transform -translate-x-1/2 w-10 h-[2px] bg-white rounded" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Location */}
          <div className="hidden sm:flex items-center gap-1">
            <RiMapPinLine size={15} />
            <h3 className="text-sm text-white font-light pt-1 truncate max-w-[8rem]">
              {user.location || 'Earth'}
            </h3>
          </div>

          {/* Profile + Settings */}
          <div className="flex items-center gap-4">
            <Link
              to='/profile'
              className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center"
              aria-label="Go to profile">
              <img
                className="w-full h-full rounded-full object-cover"
                src={user.profilePic || '/Recruiter.jpg'}
                alt={user.name ? `${user.name}'s profile picture` : 'Profile picture'}
              />
            </Link>

            <Link
              to='/setting'
              className="h-9 w-9 border border-white/30 text-white rounded-full overflow-hidden flex items-center justify-center"
              aria-label="Go to settings">
              <RiSettings2Line size={18} color="currentColor" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle navigation menu">
            {menuOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-sky-700 to-blue-700 dark:bg-[#141414] px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block text-sm font-light ${
                isActive(link.path)
                  ? 'text-white font-medium'
                  : 'text-blue-200 dark:text-neutral-300 hover:text-white'
              }`}
              onClick={() => setMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
        </div>
      )}

      <div className="w-full h-[1px] bg-white/20 dark:bg-[#555455]" />
    </div>
  );
};

export default UserNavbar;
