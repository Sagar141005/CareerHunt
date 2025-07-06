// [UNCHANGED IMPORTS]
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import UserNavbar from '../components/UserNavbar';
import {
  RiMapPin2Line,
  RiBriefcaseLine,
  RiTimeLine,
  RiFilePaper2Line,
  RiRestartLine,
  RiBuildingLine,
  RiSendPlaneFill,
  RiArrowDownSLine,
  RiArrowLeftLine
} from '@remixicon/react';
import Footer from '../components/Footer';

const Apply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userResumes, setUserResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const [generatingCover, setGeneratingCover] = useState(false);

  const [form, setForm] = useState({
    resume: '',
    coverLetter: '',
  });

  const [tailoredResume, setTailoredResume] = useState('');
  const [loadingImprove, setLoadingImprove] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/applications/details/${jobId}`);
        const app = res.data.job
        setJob(app.jobPostId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserResumes = async () => {
      try {
        const res = await api.get('/ai/resume/all');
        setUserResumes(res.data.resumes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResumes(false);
      }
    };

    fetchJob();
    fetchUserResumes();
  }, [jobId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResumeSelect = async (e) => {
    const selectedResumeId = e.target.value;
    setTailoredResume('');
    if (!selectedResumeId) {
      setForm(prev => ({ ...prev, resume: '' }));
      return;
    }

    const selectedResume = userResumes.find(r => r.id === selectedResumeId);
    if (selectedResume) {
      setForm(prev => ({ ...prev, resume: selectedResume.fileUrl }));
    }

    setLoadingImprove(true);
    try {
      const res = await api.post(`/ai/resume/improve/${selectedResumeId}/${jobId}`);
      setTailoredResume(res.data.improvedContent);
    } catch (err) {
      setTailoredResume('Failed to generate tailored resume.');
      console.error(err);
    } finally {
      setLoadingImprove(false);
    }

    try {
      setGeneratingCover(true);
      const clRes = await api.post(`/ai/cover-letter/${selectedResumeId}/${jobId}`);
      setForm(prev => ({ ...prev, coverLetter: clRes.data.content }));
    } catch (err) {
      console.error(err);
      alert('Failed to generate AI cover letter');
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedResume = userResumes.find(resume => resume.fileUrl === form.resume);
    const resumeId = selectedResume?.id;

    const tailoredResumeVersion = selectedResume?.versions?.find(version => version.job === job._id);
    const coverLetterVersion = selectedResume?.coverLetters?.find(coverLetter => coverLetter.job === job._id);

    try {
      if (!form.resume || !form.coverLetter) {
        return alert("Please complete all fields before applying.");
      }      

      await api.post(`/applications/${jobId}`, {
        resumeId,
        resumeVersionNumber: tailoredResumeVersion?.versionNumber,
        coverLetterVersionNumber: coverLetterVersion?.versionNumber
      });
      navigate('/my-applications');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application.');
    }
  };


  if (loading || !job) {
    return <div className="text-center py-24 text-gray-600 dark:text-gray-400">Loading application form...</div>;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#f8faff] to-[#eff3ff] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <UserNavbar />
      <Link
        to="/jobs"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-24 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
        <RiArrowLeftLine size={30} />
      </Link>
      <div className="max-w-7xl mx-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-12">
    
        {/* Left Panel */}
        <div className="lg:w-1/3 bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700 flex flex-col">
          <div className="mb-6 flex justify-center">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={`${job.company} logo`} className="w-20 h-20 rounded-full bg-white object-contain shadow-md" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold shadow-md">
                {job.company?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">{job.title}</h1>
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
              <span>Posted: {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          {job.description && (
            <div className="mt-8 text-sm leading-relaxed text-gray-700 dark:text-gray-300 max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 dark:scrollbar-thumb-blue-500">
              <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Job Description</h2>
              <p>{job.description}</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="lg:w-2/3 bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium select-none">AI</span>
            Apply with Smart Assistant
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Resume Select */}
            <div>
              <label htmlFor="resumeSelect" className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
                Select Resume
              </label>
              {loadingResumes ? (
                <p className="text-gray-500 dark:text-gray-400">Loading resumes...</p>
              ) : (
                <div className="relative w-full">
                  <select
                    id="resumeSelect"
                    onChange={handleResumeSelect}
                    value={userResumes.find(r => r.fileUrl === form.resume)?.id || ''}
                    required
                    className="block w-full appearance-none bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-neutral-600 px-5 py-3 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled hidden>
                      Choose from your uploaded resumes
                    </option>
                    {userResumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.title} (v{r.versions?.length + 1 || 1})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute top-[15px] font-bold right-4 text-gray-400 dark:text-gray-100">
                    <RiArrowDownSLine size={20} />
                  </div>
                </div>   
              )}
            </div>

            {/* Resume Link */}
            <div>
              <label htmlFor="resumeLink" className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
                Resume Link
              </label>
              <input
                id="resumeLink"
                type="url"
                name="resume"
                readOnly
                value={form.resume}
                className="w-full bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 cursor-not-allowed border border-gray-300 dark:border-neutral-600 px-5 py-3 rounded-xl" />
            </div>

            {/* Tailored Resume Preview */}
            {loadingImprove ? (
              <p className="text-gray-600 dark:text-gray-400 italic">Generating tailored resume...</p>
            ) : tailoredResume ? (
              <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
                <div className="cursor-pointer font-medium px-5 py-3 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2 select-none">
                  <RiFilePaper2Line />
                  View Tailored Resume (AI-Optimized)
                </div>
                <div className="max-h-72 overflow-y-auto whitespace-pre-wrap px-5 py-4 text-sm text-gray-800 dark:text-gray-200 font-mono">
                  {tailoredResume}
                </div>
              </div>
            ) : null}

            {/* Regenerate Button */}
            {form.resume && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const resumeId = userResumes.find(r => r.fileUrl === form.resume)?.id;
                      if (!resumeId) return alert("Resume not selected");
                      setGeneratingCover(true);
                      const clRes = await api.post(`/ai/cover-letter/${resumeId}/${jobId}`);
                      setForm(prev => ({ ...prev, coverLetter: clRes.data.content }));
                    } catch (err) {
                      alert('Failed to generate AI cover letter');
                    } finally {
                      setGeneratingCover(false);
                    }
                  }}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  {generatingCover ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RiRestartLine className="animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    <>
                      <RiRestartLine />
                      Regenerate AI Cover Letter
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block mb-3 font-semibold text-gray-700 dark:text-gray-200">
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
                className="w-full rounded-xl border border-gray-300 dark:border-neutral-600 px-5 py-4 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 resize-none shadow-sm focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-md transition hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400">
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
