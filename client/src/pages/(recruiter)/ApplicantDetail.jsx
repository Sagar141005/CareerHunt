import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import RecruiterPannel from "../../components/recruiter/RecruiterPannel";
import CurrentDate from "../../components/recruiter/CurrentDate";
import { MoonLoader } from "react-spinners";
import {
  RiFileTextLine,
  RiDownloadLine,
  RiTimeLine,
  RiArrowLeftLine,
  RiMailLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiLoader4Line,
  RiArrowRightLine,
} from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_OPTIONS = [
  "Applied",
  "Shortlisted",
  "Interview",
  "On-hold",
  "Hired",
  "Rejected",
];

const ApplicantDetail = () => {
  const { jobPostId, userId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [appliedResume, setAppliedResume] = useState(null);
  const [appliedCoverLetter, setAppliedCoverLetter] = useState(null);
  const [status, setStatus] = useState("");
  const [interactionHistory, setInteractionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/job-posts/applicant/${jobPostId}/${userId}`
        );
        setApplicant(res.data.applicant);
        setAppliedResume(res.data.appliedResume);
        setAppliedCoverLetter(res.data.appliedCoverLetter);
        setStatus(res.data.currentStatus);
        setInteractionHistory(res.data.interactionHistory);
      } catch (error) {
        toast.error("Failed to fetch applicant details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobPostId, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === status) {
      setIsStatusMenuOpen(false);
      return;
    }

    setUpdatingStatus(true);
    try {
      await api.put(`/job-posts/update-status/${jobPostId}/${userId}`, {
        status: newStatus,
      });
      setStatus(newStatus);
      toast.success(`Candidate moved to ${newStatus}`);

      const newLog = {
        action: "status_update",
        fromStatus: status,
        toStatus: newStatus,
        timestamps: new Date().toISOString(),
      };
      setInteractionHistory((prev) => [newLog, ...prev]);
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
      setIsStatusMenuOpen(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      case "interview":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "shortlisted":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800";
      case "on-hold":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
      case "hired":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-900/30 dark:text-neutral-300 dark:border-neutral-800";
    }
  };

  const getStatusDot = (statusKey) => {
    switch (statusKey) {
      case "Hired":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      case "Interview":
        return "bg-purple-500";
      case "Shortlisted":
        return "bg-teal-500";
      case "On-hold":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const downloadLink = (
    resumeId,
    versionNumber,
    type = "resume",
    format = "pdf"
  ) => {
    return `${import.meta.env.VITE_API_URL}/ai/${
      type === "coverLetter" ? "cover-letter/download" : "resume/download"
    }?resumeId=${resumeId}&versionNumber=${versionNumber}&format=${format}`;
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <MoonLoader color="#0164FC" size={30} />
      </div>
    );

  if (!applicant)
    return <p className="text-center mt-10">Applicant not found.</p>;

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="pt-6 px-6 lg:px-8 pb-4 shrink-0 bg-neutral-50 dark:bg-neutral-950 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-4 group"
          >
            <RiArrowLeftLine
              size={16}
              className="mr-1 group-hover:-translate-x-1 transition-transform"
            />
            Back to Applicants
          </button>

          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                Applicant Profile{" "}
                <span className="text-gray-300 dark:text-gray-600 font-light">
                  |
                </span>{" "}
                <span className="text-blue-600 dark:text-blue-400 block sm:inline">
                  {applicant.name}
                </span>
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
                Reviewing application details and history
              </p>
            </div>
            <div className="hidden sm:block">
              <CurrentDate className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:text-sm" />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 pt-2">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <img
                  src={
                    applicant.profilePic ||
                    "https://ui-avatars.com/api/?name=" + applicant.name
                  }
                  alt={applicant.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-800"
                />
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {applicant.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    <RiMailLine size={16} />{" "}
                    <a
                      href={`mailto:${applicant.email}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {applicant.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  disabled={updatingStatus}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                    isStatusMenuOpen
                      ? "ring-4 ring-blue-500/10 border-blue-300 dark:border-blue-700"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700"
                  } bg-white dark:bg-neutral-900`}
                >
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                      Current Stage
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${getStatusDot(
                          status
                        )}`}
                      />
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {status}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`pl-3 border-l border-neutral-200 dark:border-neutral-800 text-neutral-400 group-hover:text-blue-600 transition-colors ${
                      updatingStatus ? "animate-spin" : ""
                    }`}
                  >
                    {updatingStatus ? (
                      <RiLoader4Line size={20} />
                    ) : (
                      <RiArrowDownSLine
                        size={20}
                        className={`transition-transform duration-200 ${
                          isStatusMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isStatusMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-20"
                    >
                      <div className="p-1.5">
                        {STATUS_OPTIONS.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleStatusUpdate(option)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              status === option
                                ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${getStatusDot(
                                  option
                                )}`}
                              ></span>
                              {option}
                            </div>
                            {status === option && (
                              <RiCheckLine
                                size={16}
                                className="text-blue-600"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                    <RiFileTextLine size={18} /> Resume
                  </h3>
                  {appliedResume ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
                          <RiFileTextLine size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">
                            Resume_v{appliedResume.versionNumber}.pdf
                          </p>
                          <p className="text-xs text-neutral-500">
                            Submitted{" "}
                            {formatDistanceToNow(
                              new Date(appliedResume.createdAt || Date.now())
                            )}{" "}
                            ago
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={downloadLink(
                            appliedResume.resumeId,
                            appliedResume.versionNumber,
                            "resume",
                            "pdf"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          <RiDownloadLine size={16} /> PDF
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-center text-sm text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800">
                      No resume attached.
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                    <RiFileTextLine size={18} /> Cover Letter
                  </h3>
                  {appliedCoverLetter ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 relative shadow-sm">
                      <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap font-serif">
                        {appliedCoverLetter.content}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl text-center text-sm text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800">
                      No cover letter provided.
                    </div>
                  )}
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sticky top-6 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <RiTimeLine
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />{" "}
                    Activity Log
                  </h3>

                  <div className="space-y-0 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-neutral-200 dark:before:bg-neutral-800">
                    {interactionHistory?.length > 0 ? (
                      interactionHistory.map((log, idx) => (
                        <div
                          key={idx}
                          className="relative pl-10 py-3 first:pt-0 last:pb-0"
                        >
                          <div
                            className={`absolute left-1.5 top-3.5 w-4 h-4 rounded-full border-2 z-10 bg-white dark:bg-neutral-900 ${
                              idx === 0
                                ? "border-blue-500 ring-4 ring-blue-500/10"
                                : "border-neutral-300 dark:border-neutral-700"
                            }`}
                          ></div>
                          <p className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
                            {log.action.replace(/_/g, " ")}
                          </p>
                          {log.fromStatus && (
                            <div className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                  log.fromStatus
                                )}`}
                              >
                                {log.fromStatus}
                              </span>
                              <RiArrowRightLine size={12} />
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                  log.toStatus
                                )}`}
                              >
                                {log.toStatus}
                              </span>
                            </div>
                          )}
                          <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide mt-1 block">
                            {formatDistanceToNow(new Date(log.timestamps))} ago
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500 pl-10 italic">
                        No activity recorded yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApplicantDetail;
