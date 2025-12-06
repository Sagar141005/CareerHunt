import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import api from "../../api/axios";
import JobCard from "../../components/job-seeker/JobCard";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiBriefcaseLine,
  RiSearchLine,
  RiFilter3Line,
  RiFileList3Line,
  RiTrophyLine,
} from "@remixicon/react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get("/applications/applied/all");
        setApplications(response.data.jobs || []);
      } catch (error) {
        if (error.response?.status === 404) {
          setApplications([]);
        } else {
          console.error("Failed to fetch jobs", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filteredApps = applications.filter((app) => {
    const status = app.status?.toLowerCase();
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "active"
        ? ["applied", "shortlisted", "interview"].includes(status)
        : activeTab === "archived"
        ? ["rejected", "withdrawn"].includes(status)
        : status === activeTab;

    const matchesSearch =
      app.jobPostId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobPostId?.company?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Applications" },
    { id: "active", label: "Active" },
    { id: "interview", label: "Interviews" },
    { id: "hired", label: "Offers" },
    { id: "archived", label: "Archived" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <UserNavbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-col items-center md:items-baseline">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
              <RiFileList3Line className="text-neutral-400" size={32} />
              My Applications
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Manage and track your{" "}
              <span className="font-semibold text-neutral-900 dark:text-white">
                {applications.length}
              </span>{" "}
              job applications.
            </p>
          </div>

          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-blue-600 transition-colors">
              <RiSearchLine size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-neutral-500 transition-all"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-600/20"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 animate-pulse"
              />
            ))}
          </div>
        ) : filteredApps.length > 0 ? (
          <motion.div
            layout
            className="flex flex-wrap gap-6 justify-center sm:justify-start"
          >
            <AnimatePresence>
              {filteredApps.map((app) => (
                <motion.div
                  key={app._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-auto flex-shrink-0"
                >
                  <JobCard
                    job={{
                      ...app.jobPostId,
                      status: app.status,
                      _id: app.jobPostId._id,
                      applicationDate: app.createdAt,
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400">
              {activeTab === "hired" ? (
                <RiTrophyLine size={32} />
              ) : activeTab === "interview" ? (
                <RiBriefcaseLine size={32} />
              ) : (
                <RiFilter3Line size={32} />
              )}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              {searchQuery
                ? "No matches found"
                : activeTab === "all"
                ? "No applications yet"
                : `No ${activeTab} applications`}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-8">
              {searchQuery
                ? "Try adjusting your search terms."
                : activeTab === "interview"
                ? "Keep applying! Your interviews will appear here."
                : "Jobs you apply to will show up here."}
            </p>

            {activeTab === "all" && !searchQuery && (
              <Link
                to="/jobs"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <RiSearchLine size={20} /> Browse Jobs
              </Link>
            )}

            {(activeTab !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="text-blue-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyApplications;
