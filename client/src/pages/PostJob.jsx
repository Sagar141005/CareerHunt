import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../api/axios';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    location: '',
    jobType: 'full-time',
    salaryRange: '',
    numberOfOpenings: 1,
    employmentType: 'full-time',
    jobLevel: 'Mid',
    department: 'Other',
    applicationDeadline: '',
    tags: '',
    companyName: '',
    companyWebsite: '',
    companyLogo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
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
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', formData);
      navigate('/jobs');
    } catch (error) {
      console.error('Post job error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] py-12 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-10 border border-neutral-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Post a New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-10" data-color-mode="light">
          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="jobTitle">
              Job Title <span className="text-red-600">*</span>
            </label>
            <div>
                <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 pr-10"
                    required />
            </div>
          </div>

          <div>
            <label className="mb-2 font-semibold text-gray-700" htmlFor="jobDescription">
              Job Description <span className="text-red-600">*</span>
            </label>
            <div className="bg-white rounded-lg border border-gray-300">
              <MDEditor
                value={formData.jobDescription}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, jobDescription: value || '' }))
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
              <label className="mb-2 font-semibold text-gray-700" htmlFor="jobType">
                Job Type <span className="text-red-600">*</span>
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
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
              <label className="mb-2 font-semibold text-gray-700" htmlFor="salaryRange">
                Salary (annual) (Optional)
              </label>
              <input
                type="number"
                min="0"
                id="salaryRange"
                name="salaryRange"
                value={formData.salaryRange}
                onChange={handleChange}
                placeholder="e.g. 70000"
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500" />
            </div>

            <div className="w-1/2">
              <label className="mb-2 font-semibold text-gray-700" htmlFor="numberOfOpenings">
                Number of Openings <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                id="numberOfOpenings"
                name="numberOfOpenings"
                value={formData.numberOfOpenings}
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
              <label className="mb-2 font-semibold text-gray-700" htmlFor="jobLevel">
                Job Level <span className="text-red-600">*</span>
              </label>
              <select
                id="jobLevel"
                name="jobLevel"
                value={formData.jobLevel}
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
            <label className="mb-2 font-semibold text-gray-700" htmlFor="applicationDeadline">
              Application Deadline <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="applicationDeadline"
              name="applicationDeadline"
              value={formData.applicationDeadline}
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
                <label className="mb-2 font-semibold text-gray-700" htmlFor="companyName">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <div>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3">
              {loading ? (
                    <h3>Posting...</h3>
              ) : (
                <h3>Post Job</h3>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
