import React, { useEffect, useState } from 'react'
import { RiBookmarkLine, RiBookmarkFill } from '@remixicon/react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios'


const JobCard = ({ job }) => {
  const [ saved, setSaved ] = useState(job?.isSaved || false);
  const [ didMount, setDidMount ] = useState(false);
  const [ isDisabled, setIsDisabled ] = useState(false);

  const applicationStatus = job?.status; 

  const handleClick = () => {
    if(isDisabled) return;

    setSaved(prev => !prev);
    setIsDisabled(true);

    setTimeout(() => setIsDisabled(false), 1000);
  }

  useEffect(() => {
    if(!didMount) {
      setDidMount(true);
      return;
    }

    const updateSavedStatus = async () => {
      try {
        const response = await api.patch(`/applications/saved/${job._id}`, { isSaved: saved });
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to save job';
        toast.error(msg);
      }
    }

    updateSavedStatus();
  }, [saved]);

  const getStatusButtonStyle = (status) => {
    const base = 'text-sm font-medium py-2 px-4 rounded-lg cursor-pointer';
    switch (status) {
      case 'Applied':
        return `${base} bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300`;
      case 'Interview':
        return `${base} bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300`;
      case 'Shortlisted':
        return `${base} bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300`;
      case 'On-hold':
        return `${base} bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'Rejected':
        return `${base} bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300`;
      case 'Hired':
        return `${base} bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300`;
      default:
        return null;
    }
  };
  

  return (
    <div className="w-64 h-72 bg-white dark:bg-[#141414] rounded-xl flex flex-col justify-between p-4 shadow-md hover:shadow-lg transition-all duration-300">
      {/* Top: Logo + Save Button */}
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 bg-white border border-neutral-300 dark:border-gray-600 rounded-full overflow-hidden flex items-center justify-center">
          <img className="w-9 h-9 rounded-full object-contain" src={job.companyLogo} alt="" />
        </div>
        <button
          disabled={isDisabled}
          onClick={handleClick}
          className={`text-sm flex gap-1 items-center cursor-pointer transition-all duration-150
            ${saved ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400 hover:text-blue-400'}`}>
          {saved ? (
            <>
              <RiBookmarkFill size={15} color="currentColor" />
              Saved
            </>
          ) : (
            <>
              <RiBookmarkLine size={15} color="currentColor" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Company + Job Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <h5 className="text-md text-gray-900 dark:text-gray-200 truncate max-w-full">{job.company}</h5>
          <p className="text-xs text-neutral-400 dark:text-gray-500">
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">{job.title}</h2>
          <div className="flex flex-wrap gap-2">
            <h4 className="text-xs font-light bg-neutral-200 dark:bg-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg w-fit">
              {job.type}
            </h4>
            <h4 className="text-xs font-light bg-neutral-200 dark:bg-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg w-fit">
              {job.level}
            </h4>
          </div>
        </div>
      </div>

      {/* Divider + Buttons */}
      <div className="flex flex-col gap-3">
        <div className="h-0.5 w-full bg-neutral-100 dark:bg-gray-700" />
        <div className="flex justify-between items-center">
          <Link
            to={`/jobs/${job._id}`}
            state={{ job }}
            className="cursor-pointer font-medium transition-all duration-200 text-blue-600 dark:text-blue-400 hover:underline">
            Details
          </Link>

          {getStatusButtonStyle(applicationStatus) ? (
            <button
              disabled
              className={`${getStatusButtonStyle(applicationStatus)} dark:bg-opacity-10`}>
              {applicationStatus}
            </button>
          ) : (
            <Link
              to={`/apply/${job._id}`}
              className="text-white font-medium bg-black dark:bg-gray-200 dark:text-black py-2 px-4 rounded-lg hover:bg-neutral-900 dark:hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer">
              Apply with AI
            </Link>
          )}
        </div>
      </div>
    </div>

  )
}

export default JobCard