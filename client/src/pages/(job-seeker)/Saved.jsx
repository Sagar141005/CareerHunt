import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import api from "../../api/axios";
import JobCard from "../../components/job-seeker/JobCard";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import {
  RiArrowRightLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSearchLine,
  RiFileListLine,
} from "@remixicon/react";
import Button from "../../components/ui/Button";

const Saved = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/applications/saved/all");
        const jobsData = response.data.jobs || [];
        setJobs(jobsData);
      } catch (error) {
        if (error.response?.status === 404) {
          setJobs([]);
        } else {
          console.error("Failed to fetch saved jobs", error);
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
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <UserNavbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-xl">
              You have{" "}
              <span className="font-bold text-neutral-900 dark:text-white">
                {jobs.length}
              </span>{" "}
              bookmarked roles. Review them here or apply when you're ready.
            </p>
          </div>

          {jobs.length > 0 && (
            <Button icon={RiArrowRightLine}>
              <Link to="/jobs" className="items-end">
                Find more
              </Link>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full sm:w-[320px] h-[280px] bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="flex flex-col gap-12">
            <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
              {currentJobs.map((job) => (
                <div key={job._id} className="w-auto flex-shrink-0">
                  <JobCard job={job} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div className="inline-flex items-center gap-2 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <RiArrowLeftSLine size={20} />
                  </button>
                  <span className="text-sm font-medium px-4 text-neutral-700 dark:text-neutral-300">
                    Page{" "}
                    <span className="text-neutral-900 dark:text-white font-bold">
                      {currentPage}
                    </span>{" "}
                    of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <RiArrowRightSLine size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center px-4">
            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400">
              <RiFileListLine size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              No saved jobs yet
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-8">
              Jobs you bookmark will appear here. Save interesting roles to
              compare and apply later.
            </p>
            <Button icon={RiSearchLine}>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Saved;
