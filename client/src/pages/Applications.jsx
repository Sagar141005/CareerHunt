import React, { useEffect, useState } from 'react';
import RecruiterPannel from '../components/RecruiterPannel';
import CurrentDate from '../components/CurrentDate';
import { RiArrowRightSLine } from '@remixicon/react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import RecruiterSearch from '../components/RecruiterSearch';
import { MoonLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Applications = () => {

  const [jobs, setJobs] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/job-posts/all');
        setJobs(response.data.jobPosts);
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404) {
          const msg = error?.response?.data?.message || error?.message || 'Failed to load job posts.';
          toast.error(msg);
        }
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-50 to-[#F2F2F2] dark:from-gray-900 dark:to-gray-800 flex flex-col sm:flex-row overflow-hidden transition-colors duration-300">
      <RecruiterPannel />

      <div className="flex-1 flex flex-col p-6 lg:mr-4">
        <div className="flex items-center justify-between w-full flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h2>
            <div className="shrink-0 mt-1 sm:mt-0">
              <CurrentDate />
            </div>
          </div>

        <div className="px-6 sm:px-8 py-4">
          <RecruiterSearch />
        </div>

        <div className="flex justify-center px-6 sm:px-8 flex-grow">
          <div className="w-full max-w-4xl max-h-[24rem] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-y-auto transition-colors duration-300">
            {loader ? (
              <div className="flex h-96 items-center justify-center">
                <MoonLoader color="#3B82F6" size={40} />
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Link
                  to={`/applications/applicants/${job._id}`}
                  state={{ title: job.title }}
                  key={job._id}
                  className="group flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200 rounded-lg cursor-pointer">
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{job.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {job.location || 'Location not specified'}
                    </p>
                  </div>

                  <RiArrowRightSLine
                    className="text-blue-300 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200"
                    size={28} />
                </Link>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-medium">
                No job posts available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
