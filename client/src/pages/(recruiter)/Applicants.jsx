import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import RecruiterPannel from "../../components/recruiter/RecruiterPannel";
import CurrentDate from "../../components/recruiter/CurrentDate";
import RecruiterSearch from "../../components/recruiter/RecruiterSearch";
import api from "../../api/axios";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  RiArrowLeftLine,
  RiUserSearchLine,
  RiTrophyLine,
  RiBriefcaseLine,
  RiFileList3Line,
} from "@remixicon/react";
import { motion, AnimatePresence } from "motion/react";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "applied":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
    case "interview":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
    case "shortlisted":
      return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800";
    case "on-hold":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
    case "hired":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  }
};

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loader, setLoader] = useState(true);
  const [activeTab, setActiveTab] = useState("All Applications");

  const { jobId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/job-posts/applications/${jobId}`);
        setApplicants(response.data.applications);
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch applicants";
        toast.error(msg);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [jobId]);

  const filteredApplicants = useMemo(() => {
    if (activeTab === "All Applications") return applicants;
    return applicants.filter(
      (app) => app.status?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [applicants, activeTab]);

  const tabs = [
    "All Applications",
    "Applied",
    "Shortlisted",
    "Interview",
    "Hired",
    "Rejected",
  ];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">
        <div className="flex-grow overflow-visible">
          <header className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Applicants{" "}
                <span className="text-gray-300 dark:text-gray-600 font-light">
                  |
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {applicants[0]?.jobPostId?.title || "Job Role"}
                </span>
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
                Reviewing{" "}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {applicants.length}
                </span>{" "}
                total candidates
              </p>
            </div>
            <div className="hidden sm:block">
              <CurrentDate className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:text-sm" />
            </div>
          </header>

          <div className="mt-6">
            <RecruiterSearch />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-neutral-200 dark:border-neutral-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${
                  activeTab === tab
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-600/20"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-6 pt-4 custom-scrollbar">
          {loader ? (
            <div className="flex h-64 items-center justify-center">
              <MoonLoader color="#3B82F6" size={40} />
            </div>
          ) : filteredApplicants.length > 0 ? (
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout">
                {filteredApplicants.map((applicant) => (
                  <motion.div
                    key={applicant._id || applicant.userId._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={`/applications/applicant/${jobId}/${applicant.userId._id}`}
                      className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          className="h-12 w-12 rounded-full object-cover border border-neutral-100 dark:border-neutral-700 bg-neutral-50"
                          src={
                            applicant.userId?.profilePic ||
                            `https://ui-avatars.com/api/?name=${applicant.userId?.name}&background=0164FC&color=fff`
                          }
                          alt={applicant.userId.name}
                          loading="lazy"
                        />

                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                            {applicant.userId.name}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {applicant.userId.email || "No email provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 pl-4">
                        {applicant.status && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              applicant.status
                            )}`}
                          >
                            {applicant.status}
                          </span>
                        )}

                        <RiArrowLeftLine
                          className="rotate-180 text-neutral-300 dark:text-neutral-600 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 hidden sm:block"
                          size={20}
                        />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                {activeTab === "Hired" ? (
                  <RiTrophyLine size={32} />
                ) : activeTab === "Interview" ? (
                  <RiBriefcaseLine size={32} />
                ) : activeTab === "Rejected" ? (
                  <RiFileList3Line size={32} />
                ) : (
                  <RiUserSearchLine size={32} />
                )}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                {activeTab === "All"
                  ? "No applications yet"
                  : `No ${activeTab} candidates`}
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-8">
                {activeTab === "Interview"
                  ? "Candidates scheduled for interviews will appear here."
                  : activeTab === "Hired"
                  ? "Celebrate your new hires here!"
                  : "Change your filters or wait for new applications."}
              </p>

              {activeTab !== "All" && (
                <button
                  onClick={() => setActiveTab("All")}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Applicants;
