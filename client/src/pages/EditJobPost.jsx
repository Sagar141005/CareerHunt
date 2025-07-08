import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
const MDEditor = lazy(() => import('@uiw/react-md-editor'));
import api from '../api/axios';
import { RiArrowLeftLine } from '@remixicon/react';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

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
        const msg = error.response?.data?.message || error.message || 'Failed to fetch job';
        toast.error(msg);
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
      const msg = error.response?.data?.message || error.message || 'Logo upload failed';
      toast.error(msg);
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
      const msg = error.response?.data?.message || error.message || 'Failed to update job post';
      toast.error(msg);
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
      const msg = error.response?.data?.message || error.message || 'Failed to delete job post';
      toast.error(msg);
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
              <Suspense fallback={<Loader />}>
              <MDEditor
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value || "" }))}
                height={280}
                preview="edit"
                visibleDragbar={false}
                fullscreen={false}
                className="!bg-white dark:!bg-neutral-900 dark:!text-white"
              />
            </Suspense>
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

          {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. React, JavaScript, Remote"
                className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Company Information */}
            <div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                Company Information
              </h2>

              <div className="space-y-6">
                <div className="w-full">
                  <label
                    htmlFor="company"
                    className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                    Company Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp"
                    required
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyWebsite"
                    className="mb-2 font-semibold text-gray-700 dark:text-gray-200">
                    Company Website
                  </label>
                  <input
                    type="url"
                    id="companyWebsite"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>

                {formData.companyLogo && (
                  <div className="w-1/2">
                    <img
                      src={formData.companyLogo}
                      alt="Company Logo Preview"
                      className="h-24 w-24 rounded-md border object-cover"
                    />
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
                    className="hidden"
                  />
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
          <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
            <div className="bg-red-50 dark:bg-neutral-800 p-6 rounded-lg border border-red-200 dark:border-red-500 max-w-md w-full shadow-xl transition-colors">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Are you sure you want to delete this job post? This action is irreversible.
              </p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer">
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
