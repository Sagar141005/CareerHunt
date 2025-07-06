import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'
import { RiArrowLeftLine } from '@remixicon/react';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (user?.role === 'recruiter' && user.company) {
      setFormData((prev) => ({
        ...prev,
        companyName: user.company.name || '',
        companyWebsite: user.company.website || '',
        companyLogo: user.company.logoUrl || '',
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <Link
        to="/job/posts"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-4 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
        <RiArrowLeftLine size={28} />
      </Link>


      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl p-6 sm:p-10 border border-neutral-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Post a New Job</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Job Title */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="title">
              Job Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-blue-500"
              placeholder="e.g. Senior Frontend Developer"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="description">
              Job Description <span className="text-red-600">*</span>
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <MDEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value || '' }))
                }
                height={280}
                className='!bg-white dark:!bg-neutral-900 dark:!text-white'
                preview="edit"
                visibleDragbar={false}
                fullscreen={false}
              />
            </div>
          </div>

          {/* Row 1: Location + Type */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2" htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. Remote or NYC"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" htmlFor="type">Job Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>

          {/* Row 2: Salary + Openings */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2" htmlFor="salary">Salary (optional)</label>
              <input
                type="number"
                id="salary"
                name="salary"
                min="0"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" htmlFor="openings">Number of Openings</label>
              <input
                type="number"
                id="openings"
                name="openings"
                min="1"
                value={formData.openings}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Row 3: Employment Type + Level */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2" htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2" htmlFor="level">Job Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-10 appearance-none">
                <option>Entry</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
                <option>Director</option>
              </select>
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Human Resources</option>
              <option>Other</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="deadline">Application Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold mb-2" htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. React, Remote, UI"
              className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              Company Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold mb-2" htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2" htmlFor="companyWebsite">Company Website</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>

              {formData.companyLogo && (
                <div>
                  <img
                    src={formData.companyLogo}
                    alt="Company Logo"
                    className="h-24 w-24 rounded-md border object-cover"
                    loading='lazy'
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-4">
                <label
                  htmlFor="companyLogo"
                  className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition">
                  {formData.companyLogo ? 'Change Logo' : 'Upload Company Logo'}
                </label>
                <input
                  id="companyLogo"
                  name="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-6">
          <Link
              to="/job/posts"
              className="px-5 py-2.5 border border-gray-400 dark:border-neutral-500 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
