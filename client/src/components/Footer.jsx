import { RiFacebookBoxFill, RiInstagramFill, RiLinkedinBoxFill, RiSparkling2Fill, RiTwitterXFill } from '@remixicon/react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-50 to-gray-200 py-12 px-8 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        <div className="flex flex-col flex-1 space-y-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <RiSparkling2Fill size={25} />
          <h1 className="text-3xl font-semibold tracking-wide pt-1 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            CareerHunt
          </h1>
        </div>
          <p className="text-gray-700 max-w-md leading-relaxed">
            Empowering job seekers and recruiters with smart tools like resume checks, job tracking, and easy job posting.
          </p>
          
          <div className="flex space-x-6 mt-4">
            <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-500 transition">
              <RiTwitterXFill size={28} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition">
              <RiInstagramFill size={28} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-700 transition">
              <RiFacebookBoxFill size={28} />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-600 transition">
              <RiLinkedinBoxFill size={28} />
            </a>
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-3">
          <h3 className="text-xl font-semibold mb-3">For Job Seekers</h3>
          <p className="text-gray-700 cursor-pointer hover:text-blue-600 transition">Apply for Jobs</p>
          <p className="text-gray-700 cursor-pointer hover:text-blue-600 transition">Resume Analyser</p>
          <p className="text-gray-700 cursor-pointer hover:text-blue-600 transition">Tracker</p>
        </div>

        <div className="flex flex-col flex-1 space-y-3">
          <h3 className="text-xl font-semibold mb-3">For Recruiters</h3>
          <p className="text-gray-700 cursor-pointer hover:text-blue-600 transition">Post a Job</p>
          <p className="text-gray-700 cursor-pointer hover:text-blue-600 transition">Manage Jobs</p>
        </div>
      </div>

      <div className="mt-10 border-t border-blue-300 pt-6 text-center text-gray-600 text-sm space-y-2 select-text">
        <div className="flex justify-center gap-12">
          <p className="cursor-pointer hover:text-blue-600 transition">About Us</p>
          <p className="cursor-pointer hover:text-blue-600 transition">Privacy Policy</p>
          <p className="cursor-pointer hover:text-blue-600 transition">Terms & Conditions</p>
        </div>
        <p>© 2025 CareerHunt Inc • All Rights Reserved</p>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
