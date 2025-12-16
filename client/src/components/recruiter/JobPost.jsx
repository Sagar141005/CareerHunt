import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import {
  RiBuilding4Line,
  RiTimeLine,
  RiBriefcaseLine,
  RiMapPin2Line,
} from "@remixicon/react";
import Button from "../ui/Button";

const JobPost = ({ job, applicants = false }) => {
  const isOpen = job.isOpen;

  return (
    <div className="group relative flex flex-col w-full h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 hover:shadow-xl hover:shadow-neutral-200/40 dark:hover:shadow-none hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-center p-2">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
              loading="lazy"
            />
          ) : (
            <RiBuilding4Line className="text-neutral-400" size={24} />
          )}
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
            isOpen
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
              : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
          }`}
        >
          {isOpen ? "Active" : "Closed"}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[60px]">
              {job.company}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="flex items-center gap-1 text-xs shrink-0">
              <RiTimeLine size={14} />
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {(() => {
          const items = [
            job.type && {
              icon: <RiBriefcaseLine size={12} />,
              label: job.type,
            },
            job.level && {
              icon: null,
              label: job.level,
            },
            job.location && {
              icon: <RiMapPin2Line size={12} />,
              label: job.location,
            },
          ].filter(Boolean);

          const firstTwo = items.slice(0, 2);
          const remaining = items.length - 2;

          return (
            <div className="flex flex-wrap gap-2 mt-1">
              {firstTwo.map((item, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium"
                >
                  {item.icon}
                  {item.label}
                </div>
              ))}

              {remaining > 0 && (
                <div className="inline-flex items-center px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-semibold">
                  +{remaining}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div
        className={`mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid gap-3 ${
          applicants ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {!applicants && (
          <Button variant="black">
            <Link to={`/post/job/edit/${job._id}`}>Edit</Link>
          </Button>
        )}

        <Button className="w-full">
          <Link to={`/applications/applicants/${job._id}`}>Applicants</Link>
        </Button>
      </div>
    </div>
  );
};

export default JobPost;
