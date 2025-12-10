import React, { useEffect, useState } from "react";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../../api/axios";
import {
  RiArrowLeftLine,
  RiBriefcaseLine,
  RiBuildingLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiGroupLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "@remixicon/react";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ConfirmModal";
import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "../../context/ThemeContext";

const JobDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();

  const [job, setJob] = useState(null);
  const [jobPost, setJobPost] = useState(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/applications/details/${id}`);
        setJob(response.data.job);
        setJobPost(response.data.job.jobPostId);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch job details.";
        toast.error(msg);
      }
    };
    fetchJob();
  }, [id]);

  const handleWithdraw = async () => {
    try {
      await api.patch(`/applications/withdraw/${job._id}`);
      setJob((prev) => ({ ...prev, status: "Withdrawn" }));
      toast.success("Application withdrawn successfully");
      setShowWithdrawConfirm(false);
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Failed to withdraw.";
      toast.error(msg);
    }
  };

  const hasApplied =
    job?._id &&
    ["Applied", "Shortlisted", "On-hold", "Interview"].includes(job.status);

  const hasWithdrawn = job?.status === "Withdrawn";

  const notApplied = !job?._id && job?.status === null;

  if (!jobPost)
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Job not found
        </h2>
        <Link to="/jobs" className="mt-4 text-blue-600 hover:underline">
          Back to jobs
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen relative bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 flex flex-col">
      <UserNavbar />

      <div className="absolute top-20 left-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <RiArrowLeftLine size={16} /> Back to Search
        </Link>
      </div>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-6">
              <div className="h-16 w-16 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-2 flex-shrink-0">
                <img
                  src={jobPost.companyLogo || "https://via.placeholder.com/60"}
                  alt={jobPost.company}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/60")
                  }
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2 leading-tight">
                  {jobPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="font-medium text-neutral-900 dark:text-neutral-200">
                    {jobPost.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <RiMapPinLine size={14} /> {jobPost.location || "Remote"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <RiTimeLine size={14} />{" "}
                    {formatDistanceToNow(new Date(jobPost.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
            <div className="mb-10 pb-8 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
                Job Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <RiBriefcaseLine className="text-blue-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                      Employment Type
                    </p>
                    <p className="text-neutral-900 dark:text-white">
                      {jobPost.employmentType || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <RiBuildingLine
                    className="text-purple-500 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                      Work Model
                    </p>
                    <p className="text-neutral-900 dark:text-white">
                      {jobPost.type || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <RiMoneyDollarCircleLine
                    className="text-green-500 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                      Salary Range
                    </p>
                    <p className="text-neutral-900 dark:text-white">
                      {jobPost.salary && jobPost.salary > 0
                        ? `$${jobPost.salary.toLocaleString()}`
                        : "Not disclosed"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                  <RiGroupLine className="text-orange-500 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-1">
                      Department
                    </p>
                    <p className="text-neutral-900 dark:text-white">
                      {jobPost.department || "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              About the role
            </h2>

            {jobPost.description && (
              <div className="mt-4 max-w-2xl" data-color-mode={theme}>
                <MDEditor.Markdown
                  source={jobPost.description}
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    fontSize: "1rem",
                  }}
                  className="!text-neutral-600 dark:!text-neutral-300"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-6">
                Interested in this job?
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Applicants</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {jobPost.applicationCount || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Openings</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {jobPost.openings || 1}
                  </span>
                </div>
                <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800"></div>
              </div>
              {hasApplied && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-medium">
                    <RiCheckLine size={18} /> Applied on{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => setShowWithdrawConfirm(true)}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-medium transition-colors"
                  >
                    Withdraw Application
                  </button>
                </div>
              )}
              {hasWithdrawn && (
                <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-center rounded-lg text-sm font-medium">
                  Application Withdrawn
                </div>
              )}{" "}
              {notApplied && (
                <Button className="w-full mx-auto">
                  <Link to={`/apply/${jobPost._id}`}>Apply Now</Link>
                </Button>
              )}
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-3">
                <RiErrorWarningLine
                  className="text-neutral-400 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                    Safety Tip
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Do not provide bank details or make payments to any
                    recruiter. Report suspicious jobs immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ConfirmModal
        show={showWithdrawConfirm}
        onClose={() => setShowWithdrawConfirm(false)}
        onConfirm={handleWithdraw}
        title="Withdraw Application?"
        message="Are you sure? This action cannot be undone and you may not be able
        to apply again."
        confirmText="Withdraw"
        danger={true}
      />
    </div>
  );
};

export default JobDetails;
