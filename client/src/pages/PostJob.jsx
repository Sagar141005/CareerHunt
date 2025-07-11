import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'
import { RiArrowLeftLine } from '@remixicon/react';
import { toast } from 'react-toastify';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'On-Site',
    salary: '',
    openings: 1,
    employmentType: 'Full-time',
    level: 'Mid',
    department: 'Other',
    deadline: '',
    tags: '',
    company: '',
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
      const msg = error?.response?.data?.message || error.message || 'Logo upload failed.';
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/job-posts/create', { ...formData,
      salary: Number(formData.salary),
      tags: formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0) 
    });
      toast.success('Job posted successfully!');
      navigate('/job/posts');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to post job.';
      toast.error(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'recruiter' && user.company) {
      setFormData((prev) => ({
        ...prev,
        company: user.company.name || '',
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
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Row 2: Salary + Openings */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2" htmlFor="salary">Salary</label>
              <input
                type="number"
                id="salary"
                name="salary"
                min="0"
                value={formData.salary}
                onChange={handleChange}
                required
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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
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
                <option>Intern</option>
                <option>Mid</option>
                <option>Senior</option>
                <option>Lead</option>
                <option>Junior</option>
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
              <option>IT</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
              <option>Hospitality</option>
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
                <label className="block font-semibold mb-2" htmlFor="company">Company Name</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
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
              className="px-5 py-2.5 border border-gray-400 dark:border-neutral-500 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
