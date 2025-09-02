import React, { useEffect, useState } from "react";
import UserNavbar from "../components/UserNavbar";
import api from "../api/axios";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import ApplicationStagePanel from "../components/ApplicationStagePanel";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/applications/applied/all");
        setApplications(response.data.jobs);
      } catch (error) {
        const status = error.response?.status;
        if (status !== 404) {
          const msg =
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch applications.";
          toast.error(`Error: ${msg}`);
        }
      }
    };

    fetchJobs();
  }, []);

  const grouped = {
    applied: [],
    shortlisted: [],
    interview: [],
    rejected: [],
    hired: [],
  };

  applications.forEach((app) => {
    const statusKey = app.status?.toLowerCase();
    grouped[statusKey]?.push(app);
  });

  const stages = [
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
    { key: "interview", label: "Interview" },
    { key: "rejected", label: "Rejected" },
    { key: "hired", label: "Hired" },
  ];

  const hasApplications = stages.some(({ key }) => grouped[key]?.length > 0);

  return (
    <div className="w-full flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-300 transition-colors duration-300">
      <UserNavbar />

      <div className="w-full flex-1 px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold">My Applications</h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400 hidden lg:block">
            Sort by:{" "}
            <span className="text-black dark:text-gray-300 font-semibold">
              Most recent
            </span>
          </p>
        </div>

        <div className="space-y-6">
          {!hasApplications ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-500 dark:text-gray-400 text-center">
              <p className="mb-6 text-lg sm:text-xl">
                You haven't applied to any jobs yet.
              </p>
              <Link
                to="/jobs"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            stages.map(
              ({ key, label }) =>
                grouped[key]?.length > 0 && (
                  <ApplicationStagePanel
                    key={key}
                    title={label}
                    jobs={grouped[key]}
                  >
                    <div className="w-full flex flex-wrap justify-center gap-4">
                      {grouped[key].map((job) => (
                        <JobCard
                          job={{ ...job, ...job.jobPostId }}
                          key={job._id}
                        />
                      ))}
                    </div>
                  </ApplicationStagePanel>
                )
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyApplications;
