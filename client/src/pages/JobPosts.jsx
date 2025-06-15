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
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.role !== 'recruiter') {
      navigate('/dashboard');
      console.error('Not Authenticated');
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
    return <p>Loading...</p>;
  }

  return (
      <div className="w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden">
        <RecruiterPannel />
        <div className="flex-1 flex flex-col">
          <div className="flex items-baseline justify-between pr-8 py-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Job Posts</h2>
              <p className="text-sm text-gray-500 mt-1"> Manage and track your posted job openings</p>
            </div> 
            <CurrentDate />
          </div>

          <div className="px-8 flex items-center justify-between py-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {jobs.filter((job) => job.isOpen).length || '0'} Active Jobs
            </h2>
            <Link
              to="/post/job"
              className="text-md p-2 px-5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-200">
              + Add Job Post
            </Link>
          </div>

          <div
          className="flex flex-wrap gap-4 px-8 pb-10 overflow-y-auto">
          {fetching ? (
            <div className="flex h-96 items-center justify-center w-full">
              <MoonLoader color="#3B82F6" size={40} />
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="w-[23%]">
                <JobPost job={job} />
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400 font-medium w-full">
              No job posts available
            </div>
          )}
          </div>
        </div>
      </div>
  );
};

export default JobPosts;
