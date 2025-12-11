import React, { useEffect, useState } from "react";
import RecruiterPannel from "../../components/recruiter/RecruiterPannel";
import CurrentDate from "../../components/recruiter/CurrentDate";
import { RiBriefcaseLine, RiFunctionAddLine } from "@remixicon/react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import RecruiterSearch from "../../components/recruiter/RecruiterSearch";
import { MoonLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import Button from "../../components/ui/Button";
import JobPost from "../../components/recruiter/JobPost";

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/job-posts/all");
        setJobs(response.data.jobPosts);
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404) {
          const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to load job posts.";
          toast.error(msg);
        }
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex-grow overflow-auto">
          <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Applications
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
                Select a job listing below to view and manage its applicants.
              </p>
            </div>
            <div className="hidden sm:block">
              <CurrentDate className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:text-sm" />
            </div>
          </header>

          <div className="px-6 sm:px-8 py-4">
            <RecruiterSearch />
          </div>

          <div className="min-h-[400px]">
            {" "}
            {loader ? (
              <div className="flex w-full justify-center items-center h-64">
                <MoonLoader color="#3B82F6" size={40} />
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 justify-items-center md:justify-items-stretch md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                {jobs.map((job) => (
                  <JobPost key={job._id} job={job} applicants={true} />
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
      </main>
    </div>
  );
};

export default Applications;
