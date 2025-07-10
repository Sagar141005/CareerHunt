import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/applications/applied/all');
        setJobs(response.data.jobs);
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to fetch jobs';
        toast.error(msg);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800 dark:from-gray-900 dark:to-gray-700 dark:text-gray-300 transition-colors duration-300">
      <UserNavbar />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-24 transition-colors duration-300">
        <div className="flex flex-col max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            Welcome back, <span className='capitalise'>{user.name}</span> 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
            Let’s get closer to your career goals. Update your resume, apply to jobs,
            and keep track of your applications.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/resume"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow
                hover:bg-blue-700 transition cursor-pointer">
              Build Resume
            </Link>
            <Link
              to="/my-applications"
              className="px-6 py-3 bg-white text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700 cursor-pointer">
              Track Applications
            </Link>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          <img
            src="/user-home.svg"
            alt="Dashboard illustration"
            className="w-[400px] max-w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>

      <section className="px-8 md:px-20 pb-20">
        <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-xl p-8 gap-6 transition-colors duration-300">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
              👀 You’ve applied to {jobs.length} job{jobs.length !== 1 && 's'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
              Keep applying consistently. Persistence pays off!
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/jobs"
              className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium cursor-pointer">
              Find New Jobs
            </Link>
            <Link
              to="/saved"
              className="px-5 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer">
              View Saved
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-20 pb-24 w-full space-y-14">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
            Career Insights & Activity
          </h2>
          <p className="text-md text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
            Your journey, at a glance — track and grow daily.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 lg:p-8 flex-1 animate-fadeIn transition-colors duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 transition-colors duration-300">
              📄 Recent Applications
            </h3>
            {jobs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic transition-colors duration-300">
                No recent applications yet. Start applying today!
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-36 overflow-y-auto">
                {jobs.slice(0, 5).map((job) => (
                  <li
                    key={job._id}
                    className="py-3 flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                        {job.jobPostId?.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {job.jobPostId?.company}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        job.status === 'Applied'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400'
                          : job.status === 'Rejected'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400'
                      } transition-colors duration-300`} >
                      {job.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 rounded-2xl shadow-md p-6 lg:p-8 w-full lg:max-w-sm flex flex-col justify-between animate-slideUp transition-colors duration-300">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900 dark:text-blue-400 transition-colors duration-300">
              💡 Career Tip of the Day
            </h3>
            <p className="italic text-blue-800 dark:text-blue-300 flex-grow text-sm sm:text-base transition-colors duration-300">
              {[
                "Customize your resume to each job.",
                "Quantify results to stand out.",
                "Practice common interview Q&As.",
                "Follow up with recruiters.",
                "Keep building skills via online courses."
              ][new Date().getDate() % 5]}
            </p>
            <div className="mt-6 text-right text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors duration-300">
              Keep growing 💪
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
