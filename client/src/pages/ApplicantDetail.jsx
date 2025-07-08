import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RecruiterPannel from '../components/RecruiterPannel';
import CurrentDate from '../components/CurrentDate';
import { MoonLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';
import { RiArrowRightLine, RiEditLine } from '@remixicon/react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';


const STATUS_OPTIONS = [
  'Applied',
  'Shortlisted',
  'Interview',
  'On-hold',
  'Hired',
  'Rejected',
];

const ApplicantDetail = () => {
  const { jobPostId, userId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [appliedResume, setAppliedResume] = useState(null);
  const [appliedCoverLetter, setAppliedCoverLetter] = useState(null);
  const [status, setStatus] = useState('');
  const [interactionHistory, setInteractionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/job-posts/applicant/${jobPostId}/${userId}`);
        setApplicant(res.data.applicant);
        setAppliedResume(res.data.appliedResume);
        setAppliedCoverLetter(res.data.appliedCoverLetter);        
        setStatus(res.data.currentStatus);
        setSelectedStatus(res.data.currentStatus);
        setInteractionHistory(res.data.interactionHistory);
        console.log({
          resumeId: res.data.appliedResume?.resumeId,
          versionNumber: res.data.appliedResume?.versionNumber,
          appliedResume: res.data.appliedResume,
        });
        
      } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Failed to fetch interaction history';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobPostId, userId]);

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/job-posts/update-status/${jobPostId}/${userId}`, {
        status: selectedStatus,
      });
      setStatus(selectedStatus);
      setEditMode(false);

      toast.success(`Status updated to "${selectedStatus}"`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update status.";
      toast.error(msg);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <MoonLoader />
      </div>
    );
  }

  if (!applicant) return <p className="text-center mt-10 dark:text-white">No applicant data found.</p>;

  const downloadLink = (resumeId, versionNumber, type = 'resume', format = 'pdf') => {
    return `${import.meta.env.VITE_API_URL}/ai/${type === 'coverLetter' ? 'cover-letter/download' : 'resume/download'}?resumeId=${resumeId}&versionNumber=${versionNumber}&format=${format}`;
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row bg-[#F2F2F2] dark:bg-gray-900 overflow-hidden">
      <RecruiterPannel />

      <div className="flex-1 flex flex-col p-6 overflow-y-auto lg:mr-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full flex-wrap">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applicant Profile</h2>
            <div className="shrink-0 mt-1 sm:mt-0">
              <CurrentDate />
            </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={applicant.profilePic || '/Recruiter.png'}
              alt={applicant.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
              loading='lazy'
            />
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{applicant.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{applicant.email}</p>
              <div className="flex items-center mt-2 gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    {
                      Applied: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
                      Shortlisted: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
                      Interview: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
                      'On-hold': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
                      Hired: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
                      Rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
                    }[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                  {status}
                </span>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 cursor-pointer">
                  <RiEditLine />
                  <span>{editMode ? 'Cancel' : 'Update'}</span>
                </button>
              </div>
            </div>
          </div>

          {editMode && (
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm rounded-md px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer">
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Resume</h4>
          {appliedResume ? (
            <div className="text-blue-600 dark:text-blue-400 space-x-4 text-sm">
              <a href={downloadLink(appliedResume.resumeId, appliedResume.versionNumber, 'resume', 'pdf')} target="_blank" className="hover:underline">PDF</a>
              <a href={downloadLink(appliedResume.resumeId, appliedResume.versionNumber, 'resume', 'docx')} target="_blank" className="hover:underline">DOCX</a>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No resume uploaded</p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cover Letter</h4>
          {appliedCoverLetter ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-md p-4 text-sm text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 whitespace-pre-wrap overflow-x-auto">
                {appliedCoverLetter.content}
              </div>
              <div className="mt-2 text-blue-600 dark:text-blue-400 space-x-4 text-sm">
                <a href={downloadLink(appliedCoverLetter.resumeId, appliedCoverLetter.versionNumber, 'coverLetter', 'pdf')} target="_blank" className="hover:underline">PDF</a>
                <a href={downloadLink(appliedCoverLetter.resumeId, appliedCoverLetter.versionNumber, 'coverLetter', 'docx')} target="_blank" className="hover:underline">DOCX</a>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">No cover letter provided</p>
          )}
        </div>

        {/* Interaction History */}
        <div className="mt-12">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Interaction History</h4>

          {interactionHistory?.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 space-y-6 pl-6">
              {interactionHistory.map((e, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900 shadow-md" />
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md p-4 transition hover:shadow-md">
                    <p className="font-medium capitalize">{e.action.replace(/_/g, ' ')}</p>
                    {e.fromStatus && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span>{e.fromStatus}</span>
                        <RiArrowRightLine size={15} />
                        <span>{e.toStatus}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(e.timestamps), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No interactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;
