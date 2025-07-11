import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const JobPost = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-72 bg-white dark:bg-gray-900 rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
      {/* Top: Logo */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-10 w-10 border border-neutral-300 dark:border-gray-600 rounded-full overflow-hidden flex items-center justify-center bg-white">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-9 h-9 object-contain rounded-full"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Logo</span>
          )}
        </div>
      </div>

      {/* Company and Time */}
      <div className="flex items-baseline gap-2 mb-2">
        <h5 className="text-md font-semibold text-gray-900 dark:text-gray-100">{job.company}</h5>
        <p className="text-xs text-neutral-400 dark:text-gray-400">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Job Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 truncate max-w-full">{job.title}</h2>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-light bg-neutral-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg w-fit">
          {job.type}
        </span>
        <span
          className={`text-xs font-light py-2 px-3 rounded-lg w-fit ${
            job.isOpen
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
          }`}>
          {job.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100 dark:bg-gray-700 mb-4"></div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <Link
          to={`/post/job/edit/${job._id}`}
          className="text-sm font-medium bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-lg hover:bg-white dark:hover:bg-gray-200 hover:text-black dark:hover:text-black border border-black dark:border-transparent transition-colors cursor-pointer">
          Edit
        </Link>
        <Link
          to={`/applications/applicants/${job._id}`}
          className="text-sm font-medium bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-lg border border-blue-600 dark:border-blue-700 hover:border-blue-700 dark:hover:border-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors cursor-pointer">
          View Applicants
        </Link>
      </div>
    </div>
  );
};

export default JobPost;
