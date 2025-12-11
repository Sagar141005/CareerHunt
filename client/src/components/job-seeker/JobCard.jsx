import React, { useEffect, useState } from "react";
import {
  RiBookmarkLine,
  RiBookmarkFill,
  RiBuilding4Line,
  RiTimeLine,
  RiMapPin2Line,
  RiBriefcaseLine,
  RiArrowRightLine,
} from "@remixicon/react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(job?.isSaved || false);
  const [didMount, setDidMount] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const applicationStatus = job?.status;

  const handleClick = (e) => {
    e.preventDefault();
    if (isDisabled) return;

    setSaved((prev) => !prev);
    setIsDisabled(true);
    setTimeout(() => setIsDisabled(false), 1000);
  };

  useEffect(() => {
    if (!didMount) {
      setDidMount(true);
      return;
    }

    const updateSavedStatus = async () => {
      try {
        await api.patch(`/applications/saved/${job._id}`, { isSaved: saved });
        if (saved) toast.success("Job saved to bookmarks");
      } catch (error) {
        setSaved((prev) => !prev);
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to save job";
        toast.error(msg);
      }
    };

    updateSavedStatus();
  }, [saved]);

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border";
    switch (status) {
      case "Applied":
        return (
          <span
            className={`${base} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800`}
          >
            Applied
          </span>
        );
      case "Interview":
        return (
          <span
            className={`${base} bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800`}
          >
            Interviewing
          </span>
        );
      case "Shortlisted":
        return (
          <span
            className={`${base} bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800`}
          >
            Shortlisted
          </span>
        );
      case "On-hold":
        return (
          <span
            className={`${base} bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800`}
          >
            On Hold
          </span>
        );
      case "Rejected":
        return (
          <span
            className={`${base} bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800`}
          >
            Rejected
          </span>
        );
      case "Hired":
        return (
          <span
            className={`${base} bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800`}
          >
            Hired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative flex flex-col w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:shadow-xl hover:shadow-neutral-200/40 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center p-2">
          <img
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
            src={job.companyLogo || "https://via.placeholder.com/40"}
            alt={`${job.company} logo`}
          />
        </div>
        <button
          disabled={isDisabled}
          onClick={handleClick}
          className={`p-2 rounded-full transition-all duration-200 active:scale-95
            ${
              saved
                ? " text-blue-600"
                : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            }`}
        >
          {saved ? <RiBookmarkFill size={20} /> : <RiBookmarkLine size={20} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {job.company}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="flex items-center gap-1 text-xs">
              <RiTimeLine size={14} />
              {formatDistanceToNow(new Date(job.createdAt))} ago
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-1">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
            <RiBriefcaseLine size={12} />
            {job.type}
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
            <RiBuilding4Line size={12} />
            {job.level}
          </div>
          {job.location && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">
              <RiMapPin2Line size={12} />
              {job.location}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <Link
          to={`/jobs/${job._id}`}
          state={{ job }}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors flex items-center gap-1"
        >
          Details
        </Link>

        {applicationStatus ? (
          getStatusBadge(applicationStatus)
        ) : (
          <Button icon={RiArrowRightLine} variant="black">
            <Link to={`/apply/${job._id}`}>Apply</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
