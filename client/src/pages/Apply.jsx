import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // your axios instance
import { formatDistanceToNow } from 'date-fns';
import UserNavbar from '../components/UserNavbar';

import {
  RiMapPin2Line,
  RiBriefcaseLine,
  RiTimeLine,
  RiFilePaper2Line,
  RiRestartLine,
  RiBuildingLine,
  RiSendPlaneFill
} from '@remixicon/react';

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
    return <div className="text-center py-24 text-gray-500">Loading application form...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faff] to-[#eff3ff]">
      <UserNavbar />
      <div className="max-w-7xl mx-auto p-8 flex flex-col lg:flex-row gap-12">

        {/* Left Panel: Job Summary */}
        <div
          className="lg:w-1/3 bg-white rounded-3xl p-8 shadow-lg border border-gray-200
            flex flex-col"
          style={{
            backgroundImage:
              'radial-gradient(circle at top left, #E8F0FE, transparent 70%)',
          }}
        >
          {/* Company Logo */}
          <div className="mb-6 flex justify-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className="w-20 h-20 rounded-full object-contain shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold select-none shadow-md">
                {job.company?.charAt(0) || 'C'}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-700 font-medium text-lg mb-4">
            <RiBuildingLine size={22} className="text-blue-600" />
            <span>{job.company}</span>
          </div>

          {/* Job Info List */}
          <div className="flex flex-col gap-4 text-gray-700 font-medium text-base">
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
                Posted: {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          {/* Optional Job Description Preview */}
          {job.description && (
            <div className="mt-8 text-gray-700 text-sm leading-relaxed max-h-48 overflow-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
              <h2 className="font-semibold mb-2 text-gray-900">Job Description</h2>
              <p>{job.description}</p>
            </div>
          )}
        </div>


        {/* Right Panel: Application Form */}
        <div className="lg:w-2/3 bg-white rounded-3xl p-10 shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center gap-3">
            <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium select-none">
              AI
            </div>
            Apply with Smart Assistant
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Resume Select */}
            <div>
              <label
                htmlFor="resumeSelect"
                className="block mb-3 font-semibold text-gray-700"
              >
                Select Resume
              </label>
              {loadingResumes ? (
                <p className="text-gray-500">Loading resumes...</p>
              ) : (
                <select
                  id="resumeSelect"
                  onChange={handleResumeSelect}
                  value={userResumes.find(r => r.fileUrl === form.resume)?.id || ''}
                  required
                  className="w-full appearance-none bg-white rounded-xl border border-gray-300 px-5 py-3 text-gray-900
                    shadow-sm transition duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none
                    hover:border-blue-400 hover:shadow-md"
                >
                  <option value="">-- Select your resume --</option>
                  {userResumes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title} (v{r.versions?.length + 1 || 1})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Resume Link (readonly) */}
            <div>
              <label htmlFor="resumeLink" className="block mb-3 font-semibold text-gray-700">
                Resume Link
              </label>
              <input
                id="resumeLink"
                type="url"
                name="resume"
                readOnly
                value={form.resume}
                placeholder="Select a resume to autofill the link"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-100 text-gray-700 cursor-not-allowed
                  transition-shadow duration-300 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tailored Resume Preview */}
            {loadingImprove ? (
              <p className="text-gray-600 italic">Generating tailored resume...</p>
            ) : tailoredResume ? (
              <details className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <summary className="cursor-pointer font-medium px-5 py-3 hover:bg-gray-100 flex items-center gap-2 select-none">
                  <RiFilePaper2Line />
                  View Tailored Resume (AI-Optimized)
                </summary>
                <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap px-5 py-4 text-sm text-gray-800 font-mono">
                  {tailoredResume}
                </pre>
              </details>
            ) : null}

            {/* Regenerate Cover Letter */}
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
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
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
              <label htmlFor="coverLetter" className="block mb-3 font-semibold text-gray-700">
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                rows="6"
                required
                placeholder="I’m excited about this opportunity because..."
                value={form.coverLetter}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-5 py-4 text-gray-800
                  bg-white resize-none shadow-sm transition duration-200
                  focus:ring-2 focus:ring-blue-500 focus:outline-none hover:shadow-md"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-around bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl
                shadow-md transition-transform duration-150 ease-in-out
                hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer"
            >
              <span className='flex items-center gap-2'><RiSendPlaneFill size={20} /> Submit Application</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
