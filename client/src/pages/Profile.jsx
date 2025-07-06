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
  }, [user, loading, navigate]);

  if(loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <div>
        <div className="relative pb-28">
          <img
            className="h-64 w-full object-cover"
            src="/Bg-graadient.png"
            alt="background gradient"
          />
          <Link
            to="/dashboard"
            className="absolute top-4 left-4 flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 shadow-lg cursor-pointer text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200">
            <RiArrowLeftLine size={30} />
          </Link>

          <div className="absolute w-50 h-50 rounded-full bg-gray-300 dark:bg-gray-700 top-36 left-8 ring-8 ring-[#F9F9F9] dark:ring-gray-900 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={user.profilePic || '/Recruiter.jpg'}
              alt={user.name}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between px-6 md:px-12">
          <div className="max-w-xl md:max-w-none">
            <h1 className="text-4xl font-bold capitalize truncate">{user.name}</h1>
            <h3 className="text-xl text-gray-700 dark:text-gray-400">{user.designation}</h3>
            <h3 className="text-xl text-gray-600 dark:text-gray-500">{user.location || ''}</h3>
            <h4 className="text-lg mt-2">{user.bio || ''}</h4>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <Link
                to="/profile/edit"
                className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium border-2 border-blue-600 cursor-pointer hover:text-blue-600 hover:bg-transparent transition-all duration-200">
                Edit Profile
              </Link>
              <Link
                to="/setting"
                className="py-3 px-8 rounded-full text-lg font-medium border-2 border-blue-600 cursor-pointer hover:text-white hover:bg-blue-600 transition-all duration-200">
                Settings
              </Link>
            </div>
          </div>

          <div className="md:mr-20 mt-10 md:mt-0 max-w-sm md:max-w-none">
            {user.role === 'recruiter' && user.company && (
              <>
                <h3 className="text-xl font-medium">Company</h3>
                <div className="flex items-start gap-6 mt-2">
                  {user.company.logoUrl && (
                    <img
                      className="w-20 h-20 rounded-lg object-cover"
                      src={user.company.logoUrl}
                      alt="Company Logo"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-semibold">{user.company.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.company.location}</p>
                    {user.company.website && (
                      <a
                        className="text-blue-600 dark:text-blue-400 text-sm break-all hover:underline"
                        href={user.company.website}
                        target="_blank"
                        rel="noreferrer">
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
        <div className="mx-8 mt-8 pb-4 flex flex-wrap gap-6 justify-between">
          <Link
            to="/post/job"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">Post a Job</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Create and publish new job listings to find the right talent quickly for your open roles.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end pr-6">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>

          <Link
            to="/applications"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">View Applicants</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Review applications, filter top candidates, and manage your hiring pipeline with ease.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>

          <Link
            to="/profile/edit"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">Update</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Edit your company details, and recruiter info to keep your profile up to date and relevant.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="mx-8 mt-8 pb-4 flex flex-wrap gap-6 justify-between">
          <Link
            to="/jobs"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">Find Your Dream Job</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Browse and apply to top job opportunities that match your skills and goals.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end pr-6">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>

          <Link
            to="/resume"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">Get hired with AI</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Let AI help optimize your resume and stand out to potential employers.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>

          <Link
            to="/profile/edit"
            className="flex-1 min-w-[300px] h-44 bg-blue-100 dark:bg-gray-700 rounded-4xl p-6 flex justify-between group hover:shadow-lg cursor-pointer transition-all duration-200">
            <div>
              <h4 className="text-2xl font-semibold pb-4 text-gray-900 dark:text-gray-100">Update</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Keep your profile updated so that recruiters know you better.
              </p>
            </div>
            <div className="w-1/3 flex flex-col justify-center items-end">
              <RiArrowRightLine
                className="text-blue-600 border-2 p-2 rounded-full border-blue-600 group-hover:text-white group-hover:bg-blue-600 transition-all duration-300 shadow-sm"
                size={40}
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
