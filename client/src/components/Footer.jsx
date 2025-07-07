import { RiFacebookBoxFill, RiInstagramFill, RiLinkedinBoxFill, RiSparkling2Fill, RiTwitterXFill } from '@remixicon/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12 px-8 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        <div className="flex flex-col flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <RiSparkling2Fill size={25} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-semibold tracking-wide pt-1 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              CareerHunt
            </h1>
          </div>
          <p className="text-gray-700 dark:text-gray-300 max-w-md leading-relaxed transition-colors duration-300">
            Empowering job seekers and recruiters with smart tools like resume checks, job tracking, and easy job posting.
          </p>
          
          <div className="flex space-x-6 mt-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-black dark:hover:text-white transition">
              <RiTwitterXFill size={28} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition">
              <RiInstagramFill size={28} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#0765FF] transition">
              <RiFacebookBoxFill size={28} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[#0B65C2] transition">
              <RiLinkedinBoxFill size={28} />
            </a>
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <h3 className="text-xl font-semibold mb-3">For Job Seekers</h3>
          <Link
          to={'/jobs'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Apply for Jobs</Link>
          <Link
          to={'/resume'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Resume Analyser</Link>
          <Link
          to={'/my-applications'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Tracker</Link>
        </div>

        <div className="flex flex-col flex-1 space-y-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
          <h3 className="text-xl font-semibold mb-3">For Recruiters</h3>
          <Link
          to={'/post/job'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Post a Job</Link>
          <Link
          to={'/job/posts'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Manage Jobs</Link>
        </div>
      </div>

      <div className="mt-10 border-t border-blue-300 dark:border-blue-700 pt-6 text-center text-gray-600 dark:text-gray-400 text-sm space-y-2 select-text transition-colors duration-300">
        <div className="flex justify-center gap-12 flex-wrap">
          <Link
          to={'/'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">About Us</Link>
          <Link
          to={'/privacy'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Privacy Policy</Link>
          <Link
          to={'/terms'} 
          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition">Terms & Conditions</Link>
        </div>
        <p>© 2025 CareerHunt Inc • All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
