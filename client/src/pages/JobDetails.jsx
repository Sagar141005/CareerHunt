import React, { useEffect, useState } from 'react';
import UserNavbar from '../components/UserNavbar';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { RiBriefcase2Line, RiBuildingLine, RiMapPinLine } from '@remixicon/react';

const JobDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const navigate = useNavigate();

  useEffect(() => {
    if (job) return;

    const fetchJob = async () => {
      try {
        const response = await api.get(`/applications/details/${id}`);
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, job]);

  if (loading || !job) return <div className="p-8 text-gray-500 text-center">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f7faff] to-[#f0f4ff]">
      <UserNavbar />
      <div className="w-full px-4 sm:px-10 py-10 flex flex-col gap-6 max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800">Job Details</h2>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-md text-gray-600">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  {
                    label: 'Experience',
                    value: job.experience || 'Not specified',
                    icon: <RiBriefcase2Line size={18} />,
                  },
                  {
                    label: 'Salary',
                    value: job.salary ? `$${job.salary}` : 'Not disclosed',
                    icon: <span className="text-lg">$</span>,
                  },
                  {
                    label: 'Work Type',
                    value: job.type || 'Remote / On-site not set',
                    icon: <RiBuildingLine size={18} />,
                  },
                  {
                    label: 'Location',
                    value: job.location || 'Location not specified',
                    icon: <RiMapPinLine size={18} />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
                    {item.icon}
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-sm text-gray-800">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden ring-2 ring-gray-200 shadow">
              <img
                src={job.logo || '/Recruiter.jpg'}
                alt="Company Logo"
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = '/Recruiter.jpg')} />
            </div>
          </div>

          <div className="h-px bg-gray-200 my-4"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-700">
              <span>
                <strong className="text-gray-900">Posted:</strong>{' '}
                {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
              <span>
                <strong className="text-gray-900">Openings:</strong> {job.openings || 'Not specified'}
              </span>
              <span>
                <strong className="text-gray-900">Applicants:</strong> {job.applicationCount || 0}
              </span>
            </div>

            <Link
              to={`/apply/${job._id}`}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-lg font-medium shadow-md active:scale-95">
              Apply with AI
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
          <div className="text-gray-700 space-y-4 text-sm leading-relaxed">
            <p>{job.description || 'No description provided.'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
              <p>
                <strong className="text-gray-900">Level:</strong> {job.level || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900">Type:</strong> {job.type || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900">Department:</strong> {job.department || 'Not specified'}
              </p>
              <p>
                <strong className="text-gray-900">Employment:</strong> {job.employmentType || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
