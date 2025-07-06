import React, { useEffect, useState } from 'react';
import RecruiterPannel from '../components/RecruiterPannel';
import CurrentDate from '../components/CurrentDate';
import JobPost from '../components/JobPost';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MoonLoader } from 'react-spinners';

const JobPosts = () => {
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role !== 'recruiter') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/job-posts/all');
        setJobs(response.data.jobPosts || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setFetching(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</p>;
  }

  return (
    <div className="h-screen flex flex-col sm:flex-row min-h-screen bg-gradient-to-b from-gray-50 to-[#F2F2F2] dark:from-gray-900 dark:to-gray-800">
      <RecruiterPannel />

      <main className="flex-1 flex flex-col p-6 space-y-6 lg:mr-4 overflow-auto">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:gap-2">
          {/* Heading + Date (always side by side) */}
          <div className="flex items-center justify-between w-full flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Posts</h2>
            <div className="shrink-0 mt-1 sm:mt-0">
              <CurrentDate />
            </div>
          </div>

          {/* Subtext always below heading */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and track your posted job openings
          </p>
        </div>

        {/* Sub-header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {jobs.filter(job => job.isOpen).length} Active Jobs
          </span>
          <Link
            to="/post/job"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition w-full sm:w-auto text-center">
            + Add Job Post
          </Link>
        </div>

        {/* Job Cards */}
        <div className="flex flex-wrap gap-4 pb-10 justify-center lg:justify-start">
          {fetching ? (
            <div className="flex w-full justify-center items-center h-64">
              <MoonLoader color="#3B82F6" size={40} />
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="flex-grow-0 flex-shrink-0 sm:w-[48%] lg:w-[23%] min-w-[260px] transition-shadow">
                <JobPost job={job} />
              </div>
            ))
          ) : (
            <div className="w-full text-center text-gray-500 dark:text-gray-400 font-medium py-20">
              No job posts available
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default JobPosts;
