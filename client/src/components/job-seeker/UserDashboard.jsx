import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserNavbar from "./UserNavbar";
import Footer from "../Footer";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  RiBriefcase2Line,
  RiFileTextLine,
  RiBookmark3Line,
  RiArrowRightLine,
  RiLightbulbFlashLine,
  RiTimeLine,
  RiCheckDoubleLine,
} from "@remixicon/react";
import Button from "../ui/Button";

const UserDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "interview":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "Shortlisted":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800";
      case "On-hold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
      case "Hired":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-300 dark:border-neutral-800";
    }
  };

  useEffect(() => {
    const fetchData = async (url, setter) => {
      try {
        const response = await api.get(url);
        setter(response.data.jobs || []);
      } catch (error) {
        const status = error.response?.status;
        if (status === 404) {
          setter([]);
          return;
        }
        console.error(`Failed to fetch: ${url}`, error);
      }
    };

    const loadJobs = async () => {
      setLoading(true);

      await Promise.all([
        fetchData("/applications/applied/all", setJobs),
        fetchData("/applications/saved/all", setSaved),
      ]);

      setLoading(false);
    };

    loadJobs();
  }, []);

  const dailyTip = [
    "Tailor your resume for every single application. Quality over quantity.",
    "Quantify your achievements. 'Increased sales by 20%' beats 'Managed sales'.",
    "Research the company culture before your interview to ask better questions.",
    "Follow up within 24-48 hours after an interview to show continued interest.",
    "Update your LinkedIn profile headline to reflect the role you want.",
  ][new Date().getDate() % 5];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col transition-colors duration-300">
      <UserNavbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Welcome back,{" "}
                <span className="capitalize">{user.name?.split(" ")[0]}</span>{" "}
                👋
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                Here's what's happening with your job search today.
              </p>
            </div>
            <div className="flex gap-3">
              <Button icon={RiBriefcase2Line}>
                <Link to="/jobs">Find Jobs</Link>
              </Button>
              <Button icon={RiFileTextLine} variant="secondary">
                <Link to="/resume">Resume</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Total Applied
                </p>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
                  {jobs.length}
                </h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <RiCheckDoubleLine size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link
                to="/my-applications"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all applications <RiArrowRightLine size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Saved Jobs
                </p>
                <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">
                  {saved.length}
                </h3>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <RiBookmark3Line size={20} />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <Link
                to="/saved"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View saved jobs <RiArrowRightLine size={14} />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RiLightbulbFlashLine size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1 mb-2 opacity-90">
                <RiLightbulbFlashLine size={16} className="mb-1" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Daily Insight
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-95">
                "{dailyTip}"
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Recent Applications
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-neutral-500">
              Loading activity...
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                <RiBriefcase2Line size={32} />
              </div>
              <h4 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
                No applications yet
              </h4>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
                You haven't applied to any jobs yet. Start searching to see your
                activity here.
              </p>
              <Link
                to="/jobs"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Start Applying
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Job Role</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Date Applied</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {jobs.slice(0, 5).map((job) => (
                    <tr
                      key={job._id}
                      className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                        {job.jobPostId?.title || "Unknown Position"}
                      </td>
                      <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                        {job.jobPostId?.company || "Unknown Company"}
                      </td>
                      <td className="px-6 py-4 text-neutral-500 dark:text-neutral-500 flex items-center gap-2">
                        <RiTimeLine size={14} />
                        {new Date(
                          job.appliedAt || Date.now()
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {job.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {jobs.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-900/30 px-6 py-3 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                to="/my-applications"
                className="w-fit mx-auto text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all history <RiArrowRightLine size={14} />
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
