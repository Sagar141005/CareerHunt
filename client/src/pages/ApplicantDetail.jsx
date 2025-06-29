import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RecruiterPannel from '../components/RecruiterPannel';
import CurrentDate from '../components/CurrentDate';
import { MoonLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';
import { RiArrowRightLine, RiEditLine } from '@remixicon/react';
import { formatDistanceToNow } from 'date-fns';


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
      } catch (err) {
        console.error(err.response?.data || err.message);
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
    } catch (err) {
      console.error('Status update failed:', err.response?.data || err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MoonLoader />
      </div>
    );
  }

  if (!applicant) return <p>No applicant data found.</p>;

  const downloadLink = (resumeId, versionNumber, type = 'resume', format = 'pdf') => {
    return `${import.meta.env.VITE_API_URL}/ai/${type === 'coverLetter' ? 'cover-letter/download' : 'resume/download'}?resumeId=${resumeId}&versionNumber=${versionNumber}&format=${format}`;
  };

  return (
    <div className="w-full h-screen bg-[#F2F2F2] flex gap-6 overflow-hidden">
      <RecruiterPannel />

      <div className="flex-1 px-8 py-10 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Applicant Profile</h2>
          <CurrentDate />
        </div>

        {/* Profile Section */}
        <div className="flex items-center justify-between mt-8 p-6">
          <div className="flex items-center gap-6">
            <img
              src={applicant.profilePic || '/Recruiter.png'}
              alt={applicant.name}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-300"
            />
            <div>
              <h3 className="text-2xl font-semibold">{applicant.name}</h3>
              <p className="text-sm text-gray-500">{applicant.email}</p>
              <div className="flex items-center mt-2 gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    {
                      Applied: 'bg-blue-100 text-[#3B82F6]',
                      Shortlisted: 'bg-green-100 text-[#22C55E]',
                      Interview: 'bg-purple-100 text-[#8B5CF6]',
                      'On-hold': 'bg-yellow-100 text-[#FACC15]',
                      Hired: 'bg-orange-100 text-[#FB923C]',
                      Rejected: 'bg-red-100 text-[#FF6B6B]',
                    }[status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {status}
                </span>

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <RiEditLine />
                  <span className='cursor-pointer'>{editMode ? 'Cancel' : 'Update'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status Dropdown + Save */}
          {editMode && (
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 text-sm rounded-md px-5 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white text-md font-medium px-5 py-2 rounded-md shadow-sm cursor-pointer">
                Save
              </button>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-2">Resume</h4>
          {appliedResume ? (
            <div className="text-blue-600 space-x-4 text-sm">
              <a href={downloadLink(appliedResume.resumeId, appliedResume.versionNumber, 'resume', 'pdf')} target="_blank" className="hover:underline">PDF</a>
              <a href={downloadLink(appliedResume.resumeId, appliedResume.versionNumber, 'resume', 'docx')} target="_blank" className="hover:underline">DOCX</a>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No resume uploaded</p>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-2">Cover Letter</h4>
          {appliedCoverLetter ? (
            <>
              <div className="bg-white rounded-md p-4 text-sm text-gray-700 shadow-sm border border-gray-200 leading-relaxed whitespace-pre-wrap overflow-x-auto">
                {appliedCoverLetter.content}
              </div>
              <div className="mt-2 text-blue-600 space-x-4 text-sm">
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
          <h4 className="text-xl font-semibold mb-6">Interaction History</h4>

          {interactionHistory?.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 space-y-6 pl-6">
              {interactionHistory.map((e, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <span className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-2 ring-white shadow-md" />

                  <div className="bg-white shadow-sm border border-gray-200 rounded-md p-4 transition hover:shadow-md">
                    <p className="font-medium text-gray-800 capitalize">{e.action.replace(/_/g, ' ')}</p>

                    {e.fromStatus && (
                      <p className="text-sm text-gray-500 mt-1 flex gap-1">
                        <span className="font-medium text-gray-600">{e.fromStatus}</span> <RiArrowRightLine size={15} /> <span className="font-medium text-gray-600">{e.toStatus}</span>
                      </p>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
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
