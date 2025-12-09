import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { formatDistanceToNow } from "date-fns";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import {
  RiMapPin2Line,
  RiBriefcaseLine,
  RiTimeLine,
  RiBuildingLine,
  RiSendPlaneFill,
  RiArrowLeftLine,
  RiLoader4Line,
  RiMagicLine,
  RiSparkling2Fill,
  RiAddLine,
  RiFileTextLine,
  RiCheckFill,
} from "@remixicon/react";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/ui/Button";
import TextAreaField from "../../components/ui/TextAreaField";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [userResumes, setUserResumes] = useState([]);
  const [showTailoredPreview, setShowTailoredPreview] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [tailoredResumeContent, setTailoredResumeContent] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPage(true);
        const jobRes = await api.get(`/applications/details/${jobId}`);
        setJob(jobRes.data.job.jobPostId);

        const resumeRes = await api.get("/ai/resume/all");
        setUserResumes(resumeRes.data.resumes || []);
      } catch (err) {
        toast.error("Failed to load application data.");
      } finally {
        setLoadingPage(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleTailorResume = async () => {
    if (!selectedResumeId)
      return toast.warning("Please select a resume first.");
    try {
      setLoadingTailor(true);
      const resumeRes = await api.get(`/ai/resume/${selectedResumeId}`);
      const fullResume = resumeRes.data.resume;

      const response = await api.post("/ai/resume/ai/enhance", {
        text: fullResume.personal.summary || "Professional Summary",
        type: "summary",
        jobDescription: job.description,
      });

      if (response.data.success) {
        setTailoredResumeContent(response.data.improvedText);
        setShowTailoredPreview(true);
        toast.success("Resume summary tailored to this job!");
      }
    } catch (error) {
      toast.error("Failed to tailor resume.");
    } finally {
      setLoadingTailor(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedResumeId)
      return toast.warning("Please select a resume first.");
    try {
      setLoadingCoverLetter(true);
      const resumeRes = await api.get(`/ai/resume/${selectedResumeId}`);
      const fullResume = resumeRes.data.resume;

      const response = await api.post("/ai/resume/ai/cover-letter", {
        resumeData: fullResume,
        jobPost: job,
      });

      if (response.data.success) {
        setCoverLetter(response.data.coverLetter);
        toast.success("Cover letter generated!");
      }
    } catch (error) {
      toast.error("Failed to generate cover letter.");
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !coverLetter) {
      return toast.warning(
        "Please select a resume and include a cover letter."
      );
    }

    try {
      setSubmitting(true);
      await api.post(`/applications/${jobId}`, {
        resumeId: selectedResumeId,
        coverLetter: coverLetter,
        tailoredSummary: tailoredResumeContent,
      });
      toast.success("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPage || !job) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <RiLoader4Line className="animate-spin text-[#0164FC]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 flex flex-col">
      <UserNavbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white mb-8 transition-colors"
        >
          <RiArrowLeftLine size={18} /> Back to Job Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-2 flex-shrink-0 flex items-center justify-center">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/60?text=Company")
                      }
                    />
                  ) : (
                    <RiBuildingLine size={24} className="text-neutral-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight mb-1">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    <RiBuildingLine size={16} /> {job.company}
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <RiBriefcaseLine size={16} /> Type
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <RiMapPin2Line size={16} /> Location
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 flex items-center gap-2">
                    <RiTimeLine size={16} /> Posted
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
                <h3 className="font-bold text-neutral-900 dark:text-white mb-3">
                  Job Description
                </h3>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar pr-2 whitespace-pre-line">
                  {job.description}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 dark:border-neutral-800 pb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#0164FC]">
                  <RiSparkling2Fill size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Apply with AI Assistant
                  </h2>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Auto-tailor your resume and cover letter.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-neutral-900 dark:text-white">
                      Select Resume
                    </label>
                    <Link
                      to="/resume"
                      className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <RiAddLine size={14} /> New Resume
                    </Link>
                  </div>

                  {userResumes.length === 0 ? (
                    <div className="p-6 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-center bg-neutral-50 dark:bg-neutral-800/50">
                      <p className="text-neutral-500 text-sm mb-3">
                        No resumes found.
                      </p>
                      <Link
                        to="/resume"
                        className="text-sm font-semibold text-blue-600"
                      >
                        Create one now &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userResumes.map((resume) => {
                        const isSelected = selectedResumeId === resume._id;
                        return (
                          <div
                            key={resume._id}
                            onClick={() => setSelectedResumeId(resume._id)}
                            className={`
                              group relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                              ${
                                isSelected
                                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm ring-1 ring-blue-600"
                                  : "border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
                              }
                            `}
                          >
                            <div
                              className={`p-2.5 rounded-lg ${
                                isSelected
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                              }`}
                            >
                              <RiFileTextLine size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                {resume.title}
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                {resume.personal?.role || "Untitled Resume"}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600"
                                  : "border-neutral-300 dark:border-neutral-600"
                              }`}
                            >
                              {isSelected && (
                                <RiCheckFill size={14} className="text-white" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <AnimatePresence>
                    {selectedResumeId && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-2"
                      >
                        {!showTailoredPreview ? (
                          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
                            <div className="p-2 bg-white dark:bg-neutral-800 rounded-full border border-neutral-100 dark:border-neutral-700 text-blue-600">
                              <RiMagicLine size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                                Optimize for this Job
                              </p>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                                AI will rewrite your summary to match keywords.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleTailorResume}
                              disabled={loadingTailor}
                              className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {loadingTailor ? (
                                <RiLoader4Line
                                  className="animate-spin"
                                  size={14}
                                />
                              ) : (
                                "Tailor Summary"
                              )}
                            </button>
                          </div>
                        ) : (
                          /* Feedback State: Show Result */
                          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl relative group">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-1 rounded-full">
                                <RiCheckFill size={14} />
                              </span>
                              <h4 className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wide">
                                Tailored Summary
                              </h4>
                            </div>

                            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                              "{tailoredResumeContent}"
                            </p>

                            <div className="mt-3 flex gap-3">
                              <button
                                type="button"
                                onClick={() => setShowTailoredPreview(false)}
                                className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline"
                              >
                                Revert to Original
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <TextAreaField
                    label="Cover Letter"
                    name="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you a good fit for this role?"
                    onEnhance={() => handleGenerateCoverLetter()}
                    loading={loadingCoverLetter}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        Submitting...
                        <RiLoader4Line className="animate-spin" size={20} />
                      </>
                    ) : (
                      <>
                        Submit Application <RiSendPlaneFill size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Apply;
