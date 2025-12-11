import React, { useEffect, useState } from "react";
import RecruiterPannel from "../../components/recruiter/RecruiterPannel";
import CurrentDate from "../../components/recruiter/CurrentDate";
import JobPost from "../../components/recruiter/JobPost";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import {
  RiAddLine,
  RiBriefcaseLine,
  RiFunctionAddLine,
} from "@remixicon/react";
import Pagination from "../../components/ui/Pagination";

const JobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex-grow overflow-auto">
          <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Job Posts
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
                Manage and track your posted job openings
              </p>
            </div>
            <div className="hidden sm:block">
              <CurrentDate className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:text-sm" />
            </div>
          </header>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-lg">
              <span className="font-bold text-neutral-900 dark:text-white">
                {jobs.filter((job) => job.isOpen).length}
              </span>{" "}
              Active Jobs
            </p>
            <Button>
              <Link to="/post/job" className="w-fit">
                Add Job Post
                <RiAddLine size={18} className="mb-[1px]" />
              </Link>
            </Button>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex w-full justify-center items-center h-64">
                <ClipLoader color="#3B82F6" size={40} />
              </div>
            ) : jobs.length > 0 ? (
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                {currentJobs.map((job) => (
                  <div key={job._id} className="flex-shrink-0 basis-72">
                    <JobPost key={job._id} job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-center px-4">
                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                  <RiBriefcaseLine size={32} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-8 mx-auto">
                  Create your first job listing to start finding great talent.
                </p>
                <Button icon={RiFunctionAddLine}>
                  <Link to="/post/job">Create Listing</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default JobPosts;
