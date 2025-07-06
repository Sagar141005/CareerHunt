import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Applicant = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/job-posts/applications/all');
        setUsers(response.data.applications || []);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    fetchData();
  }, []);

  if (users.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 font-light px-2 py-2">No applicants found</p>;
  }

  return (
    <div>
      {users.slice(0, 10).map((user, index) => (
        <Link
          to={`/applications/applicant/${user.jobPostId._id}/${user.userId._id}`}
          key={index}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <div>
            <img
              className="h-10 w-10 object-cover content-center rounded-full"
              src={user.userId?.profilePic || 'https://via.placeholder.com/40'}
              alt={user.userId?.name || 'User'}
              loading="lazy"
            />
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-white">{user.userId?.name}</h4>
            <p className="text-sm font-light text-neutral-500 dark:text-neutral-400">
              Applied for{' '}
              <span className="text-neutral-600 dark:text-neutral-300">
                {user.jobPostId?.title || 'Unknown Role'}
              </span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Applicant;
