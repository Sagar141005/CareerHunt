import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import RecruiterPannel from "../../components/recruiter/RecruiterPannel";
import CurrentDate from "../../components/recruiter/CurrentDate";
import ResumePreview from "../../components/resume/ResumePreview";
import {
  RiPagesLine,
  RiDownloadLine,
  RiTimeLine,
  RiArrowLeftLine,
  RiFileList3Line,
  RiArrowDownSLine,
  RiCheckLine,
  RiLoader4Line,
  RiArrowRightLine,
  RiMailLine,
} from "@remixicon/react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "motion/react";
import Button from "../../components/ui/Button";

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
  const [appliedCoverLetter, setAppliedCoverLetter] = useState("");
  const [status, setStatus] = useState("");
  const [interactionHistory, setInteractionHistory] = useState([]);

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

  const handlePrintVisual = () => {
    if (!appliedResume) return;
    window.print();
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

  const formattedResumeData = React.useMemo(() => {
    if (!appliedResume) return null;
    return {
      ...appliedResume,
      skills:
        typeof appliedResume.skills === "string"
          ? appliedResume.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : appliedResume.skills || [],
      theme: appliedResume.theme || "modern",
      color: appliedResume.color || "#2563eb",
      personal: appliedResume.personal || {},
      experience: appliedResume.experience || [],
      education: appliedResume.education || [],
      projects: appliedResume.projects || [],
    };
  }, [appliedResume]);

  if (!applicant)
    return <p className="text-center mt-10">Applicant not found.</p>;

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 overflow-hidden flex-col md:flex-row">
      <RecruiterPannel />

      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
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
        <div className="flex-1 px-6 lg:px-8 pb-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8 pt-2">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <img
                  src={
                    applicant.profilePic ||
                    `https://ui-avatars.com/api/?name=${applicant.name}&background=0164FC&color=fff`
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
                  <div className="mb-4">
                    <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <RiPagesLine size={16} /> Attached Resume
                    </h3>
                  </div>

                  {appliedResume ? (
                    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
                      <div className="flex items-center gap-4 p-4">
                        <div className="h-14 w-14 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                          <RiPagesLine size={28} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-base font-bold text-neutral-900 dark:text-white truncate"
                            title={appliedResume.title}
                          >
                            {appliedResume.title || `${applicant.name}_Resume`}
                            .pdf
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-2">
                            <span>PDF Document</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                            <span>
                              Uploaded{" "}
                              {formatDistanceToNow(
                                new Date(appliedResume.createdAt)
                              )}{" "}
                              ago
                            </span>
                          </p>
                        </div>

                        <Button
                          variant="black"
                          icon={RiDownloadLine}
                          onClick={handlePrintVisual}
                        >
                          Download
                        </Button>
                      </div>

                      <div className="bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-800 px-4 -m-1 py-2 flex justify-between items-center rounded-b-xl">
                        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide">
                          Alternative Formats
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Coming soon
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30">
                      <RiPagesLine
                        className="text-neutral-300 dark:text-neutral-700 mb-2"
                        size={32}
                      />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                        No resume attached
                      </p>
                    </div>
                  )}
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                      <RiFileList3Line size={16} /> Cover Letter
                    </h3>
                    {appliedCoverLetter && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(appliedCoverLetter);
                          toast.success("Copied to clipboard");
                        }}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wide cursor-pointer"
                      >
                        Copy Text
                      </button>
                    )}
                  </div>

                  {appliedCoverLetter ? (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-8 sm:p-10">
                        <article className="prose prose-sm dark:prose-invert max-w-none">
                          <div className="font-serif text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap text-base">
                            {appliedCoverLetter}
                          </div>
                        </article>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30">
                      <RiFileList3Line
                        className="text-neutral-300 dark:text-neutral-700 mb-2"
                        size={32}
                      />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                        No cover letter provided
                      </p>
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
        <div className="hidden print:block">
          {formattedResumeData && <ResumePreview data={formattedResumeData} />}
        </div>
      </main>
    </div>
  );
};

export default ApplicantDetail;
