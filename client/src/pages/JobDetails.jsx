import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { RiArrowLeftLine, RiBriefcase2Line, RiBuildingLine, RiMapPinLine } from '@remixicon/react';
import Footer from '../components/Footer';

const JobDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [jobPost, setJobPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/applications/details/${id}`);
        setJob(response.data.job);
        setJobPost(response.data.job.jobPostId);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, []);

  const handleWithdraw = async () => {
    if (!window.confirm('Are you sure you want to withdraw your application?')) return;

    try {
      await api.patch(`/applications/withdraw/${job._id}`);
      alert('Application withdrawn successfully');
      setJob(prev => ({ ...prev, status: 'Withdrawn' }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to withdraw');
    }
  }

  if (loading || !jobPost)
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-br from-[#f7faff] to-[#f0f4ff] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <UserNavbar />
      <Link
        to="/jobs"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-24 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
        <RiArrowLeftLine size={30} />
      </Link>
      <div className="w-full px-4 sm:px-10 py-10 flex flex-col gap-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Job Details</h2>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{jobPost.title}</h2>
              <p className="text-md text-gray-600 dark:text-gray-400">{jobPost.company}</p>

              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  {
                    label: 'Experience',
                    value: jobPost.experience || 'Not specified',
                    icon: <RiBriefcase2Line size={18} />,
                  },
                  {
                    label: 'Salary',
                    value: jobPost.salary ? `$${jobPost.salary}` : 'Not disclosed',
                    icon: <span className="text-lg">$</span>,
                  },
                  {
                    label: 'Work Type',
                    value: jobPost.type || 'Remote / On-site not set',
                    icon: <RiBuildingLine size={18} />,
                  },
                  {
                    label: 'Location',
                    value: jobPost.location || 'Location not specified',
                    icon: <RiMapPinLine size={18} />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 px-4 py-2 rounded-md bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200">
                    {item.icon}
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-100">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-20 h-20 rounded-lg bg-white overflow-hidden ring-2 ring-gray-200 dark:ring-neutral-700 shadow">
              <img
                src={jobPost.companyLogo || '/Recruiter.jpg'}
                alt="Company Logo"
                className="w-full h-full object-contain"
                onError={(e) => (e.target.src = '/Recruiter.jpg')}
              />
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-neutral-700 my-4"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-700 dark:text-gray-300">
              <span>
                <strong className="text-gray-900 dark:text-white">Posted:</strong>{' '}
                {formatDistanceToNow(new Date(jobPost.createdAt), { addSuffix: true })}
              </span>
              <span>
                <strong className="text-gray-900 dark:text-white">Openings:</strong> {jobPost.openings || 'Not specified'}
              </span>
              <span>
                <strong className="text-gray-900 dark:text-white">Applicants:</strong> {jobPost.applicationCount || 0}
              </span>
            </div>

            {['Applied', 'Shortlisted', 'Interview'].includes(job?.status) ? (
              <button
                onClick={handleWithdraw}
                className="bg-red-600 hover:bg-red-700 transition text-white px-5 py-2.5 rounded-lg font-medium shadow-md active:scale-95">
                Withdraw Application
              </button>
            ) : (
              <Link
                to={`/apply/${jobPost._id}`}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-lg font-medium shadow-md active:scale-95">
                Apply with AI
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Job Description</h3>
          <div className="text-gray-700 dark:text-gray-300 space-y-4 text-sm leading-relaxed">
            <p>{jobPost.description || 'No description provided.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
              <p>
                <strong className="text-gray-900 dark:text-white">Level:</strong> {jobPost.level || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Type:</strong> {jobPost.type || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Department:</strong> {jobPost.department || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Employment:</strong> {jobPost.employmentType || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetails;
