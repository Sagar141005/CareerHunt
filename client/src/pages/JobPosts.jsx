import React, { useEffect, useState } from "react";
import RecruiterPannel from "../components/RecruiterPannel";
import CurrentDate from "../components/CurrentDate";
import JobPost from "../components/JobPost";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";

const JobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/job-posts/all");
        setJobs(response.data.jobPosts || []);
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404) {
          const msg =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch jobs.";
          toast.error(`Error: ${msg}`);
        }
      } finally {
        setFetching(false);
      }
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="h-full flex flex-col sm:flex-row min-h-screen bg-gradient-to-b from-gray-50 to-[#F2F2F2] dark:from-gray-900 dark:to-gray-800">
      <RecruiterPannel />

      <div className="flex flex-col flex-1 p-6 space-y-6 lg:mr-4">
        <main className="flex-grow overflow-auto">
          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex items-center justify-between w-full flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Job Posts
              </h2>
              <div className="shrink-0 mt-1 sm:mt-0">
                <CurrentDate />
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and track your posted job openings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {jobs.filter((job) => job.isOpen).length} Active Jobs
            </span>
            <Link
              to="/post/job"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition w-full sm:w-auto text-center cursor-pointer"
            >
              + Add Job Post
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {fetching ? (
              <div className="flex w-full justify-center items-center h-64">
                <MoonLoader color="#3B82F6" size={40} />
              </div>
            ) : jobs.length > 0 ? (
              currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex-grow-0 flex-shrink-0 sm:w-[48%] lg:w-[23%] min-w-[260px] transition-shadow"
                >
                  <JobPost job={job} />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-gray-500 dark:text-gray-400 font-medium py-20">
                No job posts available
              </div>
            )}
          </div>
        </main>

        {totalPages >= 1 && (
          <div className="w-full flex justify-center mt-12 mb-4 px-4">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg px-4 py-2 shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-all bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-md font-medium transition-all bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPosts;
