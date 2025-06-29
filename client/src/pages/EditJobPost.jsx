import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../api/axios';
import { RiArrowLeftLine } from '@remixicon/react';

const EditJobPost = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    salary: '',
    openings: 1,
    employmentType: 'full-time',
    level: 'Mid',
    department: 'Other',
    deadline: '',
    tags: '',
    company: '',
    companyWebsite: '',
    companyLogo: '',
  });

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await api.get(`/job-posts/${jobId}`);
        const job = response.data.jobPost;

        setFormData({
          title: job.title || '',
          description: job.description || '',
          location: job.location || '',
          type: job.type || 'full-time',
          salary: job.salary || '',
          openings: job.openings || 1,
          employmentType: job.employmentType || 'full-time',
          level: job.level || 'Mid',
          department: job.department || 'Other',
          deadline: job.deadline?.split('T')[0] || '',
          tags: job.tags?.join(', ') || '',
          company: job.company || '',
          companyWebsite: job.companyWebsite || '',
          companyLogo: job.companyLogo || '',
        });
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

    try {
      setLoading(true);
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, companyLogo: data.secure_url }));
    } catch (error) {
      console.error('Logo upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/job-posts/${jobId}`, {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
      });
      navigate('/job/posts');
    } catch (error) {
      console.error('Update job error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/job-posts/${jobId}`);
      navigate('/job/posts');
    } catch (error) {
      console.error('Delete job error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] py-12 px-6 sm:px-10">
      <Link 
      to='/job/posts'
      className='absolute flex items-center justify-center h-12 w-12 rounded-full bg-white top-4 left-4 shadow-lg cursor-pointer text-[#ccc] hover:text-black  transition-all duration-200'>
        <RiArrowLeftLine size={30} color='currentColor' />
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-10 border border-neutral-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Edit Job Post</h1>

        <form onSubmit={handleSubmit} className="space-y-10" data-color-mode="light">
        <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="title">
              Job Title <span className="text-red-600">*</span>
            </label>
            <div>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 pr-10"
                    required />
            </div>
          </div>

          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="description">
              Job Description <span className="text-red-600">*</span>
            </label>
            <div className="bg-white rounded-lg border border-gray-300">
              <MDEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value || '' }))
                }
                height={280}
                preview="edit"
                visibleDragbar={false}
                fullscreen={false}
                data-color-mode="light" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="location">
                Location <span className="text-red-600">*</span>
              </label>
              <div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote or New York"
                  className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 pr-10"
                  required />
              </div>
            </div>

            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="type">
                Job Type <span className="text-red-600">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
                required>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="salary">
                Salary (annual) (Optional)
              </label>
              <input
                type="number"
                min="0"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 70000"
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500" />
            </div>

            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="openings">
                Number of Openings <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                id="openings"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
                required />
            </div>
          </div>


          <div className="flex gap-6">
            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="employmentType">
                Employment Type <span className="text-red-600">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
                required>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="level">
                Job Level <span className="text-red-600">*</span>
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
                required>
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
                <option>Director</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="department">
              Department <span className="text-red-600">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
              required>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Human Resources</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="deadline">
              Application Deadline <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. React, JavaScript, Remote"
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500"/>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-gray-200 pb-2">
              Company Information
            </h2>

            <div className="space-y-6">
              <div className="w-full">
                <label className="mb-2 font-semibold text-gray-700" htmlFor="company">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 pr-10"
                    required />
                </div>
              </div>

              <div className="">
                <label className="mb-2 font-semibold text-gray-700" htmlFor="companyWebsite">
                  Company Website
                </label>
                <div>
                  <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 pr-10" />
                </div>
              </div>

              {formData.companyLogo && (
                <div className="w-1/2">
                  <img
                    src={formData.companyLogo}
                    alt="Company Logo Preview"
                    className="h-24 w-24 rounded-md border object-cover" />
                </div>
              )}

              <div className="w-full flex items-center gap-6 mt-4">
                <label
                  htmlFor="companyLogo"
                  className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition">
                  <span>{formData.companyLogo ? 'Change Logo' : 'Upload Company Logo'}</span>
                </label>
                <input
                  id="companyLogo"
                  name="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-10">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-lg border border-red-300 shadow-sm hover:bg-red-200 transition cursor-pointer">
              Delete Job
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold border border-blue-600 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3">
                {loading ? <h3>Updating...</h3> : <h3>Update Job</h3>}
            </button>
          </div>
        </form>

          {showDeleteConfirm && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
              <h3 className="text-lg font-semibold text-red-600">Confirm Deletion</h3>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete this job post? This action is irreversible.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100 cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          </div>
          )}

      </div>
    </div>
  );
};

export default EditJobPost;
