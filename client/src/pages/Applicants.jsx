import React, { useEffect, useState } from 'react';
import RecruiterPannel from '../components/RecruiterPannel';
import CurrentDate from '../components/CurrentDate';
import RecruiterSearch from '../components/RecruiterSearch';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { MoonLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';

const Applicants = () => {
  const { user, loading } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [loader, setLoader] = useState(true);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { title } = location.state || {};

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
    const fetchData = async () => {
      try {
        const response = await api.get(`/job-posts/applications/${jobId}`);
        setApplicants(response.data.applications);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-50 to-[#F2F2F2] dark:from-gray-900 dark:to-gray-800 flex flex-col sm:flex-row overflow-hidden transition-colors duration-300">
      <RecruiterPannel />
      
      <div className="flex-1 flex flex-col p-6 lg:mr-4">
        <div className="flex items-center justify-between w-full flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants</h2>
            <div className="shrink-0 mt-1 sm:mt-0">
              <CurrentDate />
            </div>
        </div>


        <div className="mt-2 lg:text-sm text-gray-600 dark:text-gray-300 sm:mt-0 sm:text-lg">
          New applicants for <span className="font-medium">{title || "Job"}</span>
        </div>

        <div className="mt-6 sm:px-0">
          <RecruiterSearch />
        </div>

        <div className="flex justify-center px-4 sm:px-8 flex-grow">
          <div className="w-full max-w-4xl max-h-[24rem] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-y-auto transition-colors duration-300">
            {loader ? (
              <div className="flex h-96 items-center justify-center">
                <MoonLoader color="#3B82F6" size={40} />
              </div>
            ) : applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <Link
                  to={`/applications/applicant/${jobId}/${applicant.userId._id}`}
                  key={index}
                  className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img
                      className="h-10 w-10 object-cover rounded-full ring-1 ring-gray-300 dark:ring-gray-600"
                      src={applicant.userId.profilePic || '/Recruiter.png'}
                      alt="Applicant"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-gray-800 dark:text-gray-100 font-medium text-base">
                        {applicant.userId.name}
                      </h4>
                      <h5 className="text-sm text-gray-500 dark:text-gray-400 hover:underline">
                        View full profile
                      </h5>
                    </div>
                  </div>

                  {applicant.status && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold
                        ${
                          applicant.status === 'Applied'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                            : applicant.status === 'Shortlisted'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                            : applicant.status === 'On-hold'
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                            : applicant.status === 'Interview'
                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                            : applicant.status === 'Hired'
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
                            : applicant.status === 'Rejected'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                      {applicant.status}
                    </span>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 dark:text-gray-500 font-medium">
                No applicants yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
