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
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      <Link
        to="/job/posts"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-4 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
        <RiArrowLeftLine size={30} />
      </Link>
  
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl p-6 sm:p-10 border border-neutral-200 dark:border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Edit Job Post</h1>
  
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Job Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Job Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Developer"
              required
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
          </div>
  
          {/* Job Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Job Description <span className="text-red-600">*</span>
            </label>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <MDEditor
                value={formData.description}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, description: value || "" }))
                }
                height={280}
                preview="edit"
                visibleDragbar={false}
                fullscreen={false}
                className="!bg-white dark:!bg-neutral-900 dark:!text-white" />
            </div>
          </div>
  
          {/* Location & Job Type */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="location"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote or New York"
                required
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
  
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="type"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Job Type <span className="text-red-600">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </div>
  
          {/* Salary & Openings */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="salary"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
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
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
  
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="openings"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Number of Openings <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                id="openings"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
            </div>
          </div>
  
          {/* Employment Type & Job Level */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="employmentType"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Employment Type <span className="text-red-600">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none" >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
  
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="level"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Job Level <span className="text-red-600">*</span>
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="director">Director</option>
              </select>
            </div>
          </div>
  
          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Department <span className="text-red-600">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 appearance-none">
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="human-resources">Human Resources</option>
              <option value="other">Other</option>
            </select>
          </div>
  
          {/* Application Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Application Deadline <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100" />
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default EditJobPost;
