// [UNCHANGED IMPORTS]
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { formatDistanceToNow } from "date-fns";
import UserNavbar from "../../components/job-seeker/UserNavbar";
import {
  RiMapPin2Line,
  RiBriefcaseLine,
  RiTimeLine,
  RiFilePaper2Line,
  RiLoopRightLine,
  RiBuildingLine,
  RiSendPlaneFill,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiBardFill,
} from "@remixicon/react";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [generatingCover, setGeneratingCover] = useState(false);

  const [form, setForm] = useState({
    resumeSelectValue: "",
    resumeLink: "",
    resumeContent: "",
    coverLetter: "",
  });

  const [tailoredResume, setTailoredResume] = useState("");
  const [loadingImprove, setLoadingImprove] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/applications/details/${jobId}`);
        const app = res.data.job;
        setJob(app.jobPostId);
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Failed to load job details.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserResumes = async () => {
      try {
        const res = await api.get("/ai/resume/all");
        setUserResumes(res.data.resumes);
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Failed to load your resumes.";
        toast.error(msg);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchJob();
    fetchUserResumes();
  }, [jobId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResumeSelect = async (e) => {
    const selectedValue = e.target.value;
    setForm((prev) => ({ ...prev, resumeSelectValue: selectedValue }));
    setTailoredResume("");

    if (!selectedValue) {
      setForm((prev) => ({ ...prev, resumeContent: "", resumeLink: "" }));
      return;
    }

    const [resumeId, versionPart] = selectedValue.split("-");
    const selectedResume = userResumes.find((r) => r.id === resumeId);
    if (!selectedResume) {
      setForm((prev) => ({ ...prev, resumeContent: "", resumeLink: "" }));
      return;
    }

    if (versionPart === "original") {
      setForm((prev) => ({
        ...prev,
        resumeContent: "",
        resumeLink: selectedResume.fileUrl,
      }));
    } else if (versionPart.startsWith("v")) {
      const versionNumber = parseInt(versionPart.slice(1), 10);
      const version = selectedResume.versions.find(
        (v) => v.versionNumber === versionNumber
      );
      setForm((prev) => ({
        ...prev,
        resumeContent: version?.content || "",
        resumeLink: selectedResume.fileUrl, // fallback or original URL
      }));
    }
  };

  const handleResumeImprove = async (e) => {
    const selectedValue = form.resumeSelectValue;
    if (!selectedValue) return toast.warning("Please select a resume");

    const [resumeId, versionPart] = selectedValue.split("-");
    if (!resumeId) return toast.warning("Invalid resume selection");

    setLoadingImprove(true);
    try {
      const res = await api.post(`/ai/resume/improve/${resumeId}/${jobId}`);
      setTailoredResume(res.data.improvedContent);
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to generate tailored resume.";
      toast.error(msg);
      setTailoredResume(msg);
    } finally {
      setLoadingImprove(false);
    }
  };

  const handleCoverLetter = async (e) => {
    const selectedValue = form.resumeSelectValue;
    if (!selectedValue) return toast.warning("Please select a resume");

    const [resumeId, versionPart] = selectedValue.split("-");
    if (!resumeId) return toast.warning("Invalid resume selection");

    try {
      setGeneratingCover(true);
      const clRes = await api.post(`/ai/cover-letter/${resumeId}/${jobId}`);
      setForm((prev) => ({ ...prev, coverLetter: clRes.data.content }));
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to generate cover letter.";
      toast.error(msg);
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedValue = form.resumeSelectValue;
    if (!selectedValue) return toast.warning("Please select a resume");

    const [resumeId, versionPart] = selectedValue.split("-");
    const selectedResume = userResumes.find((r) => r.id === resumeId);
    if (!selectedResume) return toast.warning("Invalid resume selected");

    // Determine resume version number from selection
    let resumeVersionNumber = undefined;
    if (versionPart && versionPart.startsWith("v")) {
      resumeVersionNumber = parseInt(versionPart.slice(1), 10);
    } else if (versionPart === "original") {
      // original version has no version number, keep undefined or 0 if you prefer
      resumeVersionNumber = undefined;
    }

    // Find cover letter version for the job (if any)
    const coverLetterVersion = selectedResume?.coverLetters?.find(
      (cl) => cl.job === job._id
    );

    try {
      if (!form.resumeSelectValue || !form.coverLetter) {
        return toast.warning("Please complete all fields before applying.");
      }

      await api.post(`/applications/${jobId}`, {
        resumeId,
        resumeVersionNumber, // from selectedValue
        coverLetterVersionNumber: coverLetterVersion?.versionNumber, // from resume data
      });

      toast.success("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to submit application.";
      toast.error(msg);
    }
  };

  if (loading || !job) {
    return (
      <div className="text-center py-24 text-gray-600 dark:text-gray-400">
        Loading application form...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#f8faff] to-[#eff3ff] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <UserNavbar />
      <Link
        to="/jobs"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-24 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute"
      >
        <RiArrowLeftLine size={30} />
      </Link>
      <div className="max-w-7xl mx-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-12">
        {/* Left Panel */}
        <div className="lg:w-1/3 bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700 flex flex-col">
          <div className="mb-6 flex justify-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className="w-20 h-20 rounded-full bg-white object-contain shadow-md"
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold shadow-md">
                {job.company?.charAt(0) || "C"}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
            {job.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-lg mb-4">
            <RiBuildingLine size={22} className="text-blue-600" />
            <span>{job.company}</span>
          </div>

          <div className="flex flex-col gap-4 text-gray-700 dark:text-gray-300 text-base">
            <div className="flex items-center gap-3">
              <RiBriefcaseLine size={20} className="text-blue-500" />
              <span>Type: {job.type}</span>
            </div>
            <div className="flex items-center gap-3">
              <RiMapPin2Line size={20} className="text-blue-500" />
              <span>Location: {job.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <RiTimeLine size={20} className="text-blue-500" />
              <span>
                Posted:{" "}
                {formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {job.description && (
            <div className="mt-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 dark:scrollbar-thumb-blue-500">
              <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Job Description
              </h2>
              <p>{job.description}</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:w-2/3 bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium select-none">
              AI
            </span>
            Apply with Smart Assistant
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Resume Select */}
            <div>
              <label
                htmlFor="resumeSelect"
                className="block mb-3 font-semibold text-gray-700 dark:text-gray-200"
              >
                Select Resume
              </label>
              {loadingResumes ? (
                <p className="text-gray-500 dark:text-gray-400">
                  Loading resumes...
                </p>
              ) : (
                <div className="relative w-full">
                  <select
                    id="resumeSelect"
                    onChange={handleResumeSelect}
                    value={form.resumeSelectValue || ""}
                    required
                    className="block w-full appearance-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-neutral-600 px-5 py-3 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled hidden>
                      Choose from your uploaded resumes
                    </option>
                    {userResumes.map((r) => (
                      <optgroup key={r.id} label={r.title}>
                        {/* Original resume option */}
                        <option value={`${r.id}-original`}>
                          Original Resume
                        </option>
                        {/* Versions */}
                        {r.versions.map((version) => (
                          <option
                            key={`${r.id}-v${version.versionNumber}`}
                            value={`${r.id}-v${version.versionNumber}`}
                          >
                            {`Improved (${version.type}) v${version.versionNumber}`}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-[15px] font-bold right-4 text-gray-400 dark:text-gray-100">
                    <RiArrowDownSLine size={20} />
                  </div>
                </div>
              )}
            </div>

            {form.resumeSelectValue && (
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleResumeImprove()}
                  className={`inline-flex items-center px-5 py-3 rounded-xl text-white font-semibold shadow-sm transition duration-200 ease-in-out cursor-pointer
                  ${
                    loadingImprove
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 opacity-70 cursor-wait"
                      : "bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800"
                  }`}
                  disabled={loadingImprove}
                >
                  <RiBardFill className="mr-2 h-5 w-5 text-white" />
                  {loadingImprove
                    ? "Improving with AI..."
                    : "Improve Resume with AI"}
                </button>
              </div>
            )}

            {/* Resume Link */}
            <div>
              <label
                htmlFor="resumeLink"
                className="block mb-3 font-semibold text-gray-700 dark:text-gray-200"
              >
                Resume Link
              </label>
              <input
                id="resumeLink"
                type="url"
                name="resumeLink"
                readOnly
                value={form.resumeLink}
                className="w-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 cursor-not-allowed border border-gray-300 dark:border-neutral-600 px-5 py-3 rounded-xl"
              />
            </div>

            {/* Tailored Resume Preview */}
            {loadingImprove ? (
              <p className="text-gray-600 dark:text-gray-400 italic">
                Generating tailored resume...
              </p>
            ) : tailoredResume || form.resumeContent ? (
              <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                <div className="cursor-pointer font-medium px-5 py-3 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 select-none">
                  <RiFilePaper2Line />
                  {tailoredResume
                    ? "View Tailored Resume (AI-Optimized)"
                    : "Preview Improved Resume"}
                </div>
                <div className="max-h-72 overflow-y-auto whitespace-pre-wrap px-5 py-4 text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {tailoredResume || form.resumeContent}
                </div>
              </div>
            ) : null}

            {/* Regenerate Button */}
            {form.resumeSelectValue && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => handleCoverLetter()}
                  className={`inline-flex items-center px-5 py-3 rounded-xl text-white font-semibold shadow-sm transition duration-200 ease-in-out cursor-pointer
                  ${
                    generatingCover
                      ? "bg-gradient-to-r from-purple-500 to-violet-600 opacity-70 cursor-wait"
                      : "bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800"
                  }`}
                >
                  {generatingCover ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RiLoopRightLine className="animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    <>
                      <RiBardFill /> &nbsp; Generate AI Cover Letter
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <label
                htmlFor="coverLetter"
                className="block mb-3 font-semibold text-gray-700 dark:text-gray-200"
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows="6"
                required
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="I’m excited about this opportunity because..."
                className="w-full rounded-xl border border-gray-300 dark:border-neutral-600 px-5 py-4 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 resize-none shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-md transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
            >
              <RiSendPlaneFill size={20} />
              Submit Application
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Apply;
