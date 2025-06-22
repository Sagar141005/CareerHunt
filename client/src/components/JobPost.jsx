import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';

const JobPost = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-72 bg-white rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="h-10 w-10 border border-neutral-300 rounded-full overflow-hidden flex items-center justify-center bg-white">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-9 h-9 object-contain rounded-full"/>
          ) : (
            <span className="text-xs text-gray-400">Logo</span>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <h5 className="text-md font-semibold text-gray-900">{job.company}</h5>
        <p className="text-xs text-neutral-400">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
      </div>

      <h2 className="text-xl font-semibold text-black mb-3 line-clamp-2">{job.title}</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs font-light bg-neutral-200 py-2 px-3 rounded-lg w-fit">
          {job.type}
        </span>
        <span
          className={`text-xs font-light py-2 px-3 rounded-lg w-fit ${
            job.isOpen
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}>
          {job.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="h-px bg-neutral-100 mb-4"></div>

      <div className="flex justify-between items-center">
        <Link
          to={`/post/job/edit/${job._id}`}
          className="text-sm font-medium bg-black text-white py-2 px-4 rounded-lg hover:bg-white hover:text-black border border-black transition-colors">
          Edit
        </Link>
        <Link
          to={`/applications/applicants/${job._id}`}
          className="text-sm font-medium bg-blue-600 text-white py-2 px-4 rounded-lg border border-blue-600 hover:border-blue-700 hover:bg-blue-700 transition-colors">
          View Applicants
        </Link>
      </div>
    </div>
  );
};

export default JobPost;
