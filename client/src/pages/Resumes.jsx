import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import UserNavbar from '../components/UserNavbar';
import { supabase } from '../utils/supabaseClient';
import { RiFileUploadLine, RiSparkling2Fill } from '@remixicon/react';


const Resumes = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/ai/resume/all');
      setResumes(response.data.resumes || []);
    } catch (err) {
      setError('Failed to fetch resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filePath = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: publicUrlError } = supabase
        .storage
        .from('resumes')
        .getPublicUrl(filePath);

      if (publicUrlError || !publicUrlData?.publicUrl) {
        throw new Error('Failed to retrieve public URL from Supabase');
      }

      const fileType = file.name.split('.').pop().toLowerCase();
      const payload = { title: file.name, fileUrl: publicUrlData.publicUrl, fileType };

      await api.post('/ai/resume/upload', payload);
      fetchResumes();
    } catch (error) {
      console.error('Resume upload error:', error.message);
      alert('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const improveResume = async (resumeId) => {
    try {
      await api.post(`/ai/resume/improve/${resumeId}`);
      await fetchResumes();
      alert('Resume improved successfully!');
    } catch {
      alert('Failed to improve resume. Try again.');
    }
  };
  


  const downloadResume = (resumeId, versionNumber, format) => {
    const url = `${import.meta.env.VITE_API_URL}/ai/resume/download?resumeId=${resumeId}&versionNumber=${versionNumber}&format=${format}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative bg-[#F9F9F9] min-h-screen">
      <UserNavbar />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-xl w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <RiFileUploadLine className="w-6 h-6" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept=".pdf,.doc,.docx"
        disabled={uploading}
      />

      <div className="w-full h-full px-12 py-8 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">My Resumes</h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg py-20">Loading your resumes...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-medium">{error}</p>
        ) : resumes.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="mb-6 text-xl">No resumes yet.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition font-semibold"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-3xl shadow-md px-6 py-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{resume.title}</h2>
                    <p className="text-sm text-gray-400 uppercase">
                      {resume.fileUrl.split('.').pop() || 'Unknown'} File
                    </p>
                  </div>
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
                    View Original
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <button
                    onClick={() => improveResume(resume.id)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition-all font-semibold cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <RiSparkling2Fill className="w-4 h-4" color="#FFE138" /> Improve
                    </span>
                  </button>
                </div>

                {resume.versions?.length > 0 && (
                  <div className="border-t pt-4 mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {resume.versions.map((v) => (
                      <div
                        key={v.versionNumber}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            V{v.versionNumber}{' '}
                            <span className="text-gray-500 font-normal">({v.type})</span>
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{v.contentPreview}</p>
                        </div>
                        <button
                          onClick={() => downloadResume(resume.id, v.versionNumber, 'pdf')}
                          className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-600 font-semibold hover:bg-blue-200"
                        >
                          Download PDF
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumes;
