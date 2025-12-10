import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { RiArrowRightLine, RiBriefcaseLine } from "@remixicon/react";

const Applicant = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/job-posts/applications/all");
        setUsers(response.data.applications || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  if (users.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
        <RiBriefcaseLine size={24} className="opacity-20" />
        <span className="text-sm">No candidates yet</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {users.slice(0, 8).map((user, index) => (
        <Link
          to={`/applications/applicant/${user.jobPostId?._id}/${user.userId?._id}`}
          key={index}
          className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 transition-all duration-200"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <img
                className="h-10 w-10 object-cover rounded-full border border-neutral-100 dark:border-neutral-700 bg-white"
                src={
                  user.userId?.profilePic ||
                  `https://ui-avatars.com/api/?name=${user.userId?.name}&background=0164FC&color=fff`
                }
                alt={user.userId?.name}
                loading="lazy"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                {user.userId?.name || "Unknown Candidate"}
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-1">
                <span className="truncate max-w-[150px]">
                  {user.jobPostId?.title}
                </span>
              </p>
            </div>
          </div>

          <div className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 pl-2">
            <RiArrowRightLine size={18} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Applicant;
