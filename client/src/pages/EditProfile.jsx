import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'
import MDEditor from '@uiw/react-md-editor';
import { RiArrowLeftLine } from '@remixicon/react';

const EditProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    profilePic: '',
    bio: '',
    location: '',
    designation: '',
    company: {
      name: '',
      logoUrl: '',
      website: '',
      location: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('company.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [key]: value,
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImage = async (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    const file = files[0];
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    imageFormData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'POST',
        body: imageFormData
      });

      const data = await res.json();
      const url = data.secure_url;

      if (name === 'profilePic') {
        setFormData(prev => ({ ...prev, profilePic: url }));
      } else if (name === 'company.logoUrl') {
        setFormData(prev => ({
          ...prev,
          company: { ...prev.company, logoUrl: url }
        }));
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      setFormData({
        name: user.name || '',
        profilePic: user.profilePic || '',
        bio: user.bio || '',
        location: user.location || '',
        designation: user.designation || '',
        company: {
          name: user.company?.name || '',
          logoUrl: user.company?.logoUrl || '',
          website: user.company?.website || '',
          location: user.company?.location || '',
        },
      });
    }

    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('auth/profile', formData);
      navigate('/profile');
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 md:px-8 bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Link
        to="/profile"
        className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-4 left-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
        <RiArrowLeftLine size={30} />
      </Link>

      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-300 dark:border-neutral-700 pb-2 mb-6">👤 Personal Info</h2>

            <div className="flex flex-wrap gap-6">
              <div className="w-full md:w-[48%]">
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
              </div>

              <div className="w-full md:w-[48%]">
                <label className="block mb-1 font-medium">Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 text-lg font-semibold">Bio</label>
              <MDEditor
                value={formData.bio}
                onChange={(value) => setFormData(prev => ({ ...prev, bio: value || '' }))}
                preview="edit"
                height={300}
                className="!bg-white dark:!bg-neutral-900 dark:!text-white" />
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-semibold">Profile Picture</label>
              {formData.profilePic && (
                <img src={formData.profilePic} alt="Preview" className="w-24 h-24 object-cover rounded-md mb-3" />
              )}
              <label
                htmlFor="profilePic"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 cursor-pointer">
                {formData.profilePic ? 'Change Profile Picture' : 'Upload Profile Picture'}
              </label>
              <input type="file" id="profilePic" name="profilePic" accept="image/*" onChange={handleImage} className="hidden" />
            </div>
          </div>

          {user.role === 'recruiter' && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-300 dark:border-neutral-700 pb-2 mb-6">🏢 Company Info</h2>

              <div className="flex flex-wrap gap-6">
                <div className="w-full md:w-[48%]">
                  <label className="block mb-1 font-medium">Designation</label>
                  <input
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
                </div>

                <div className="w-full md:w-[48%]">
                  <label className="block mb-1 font-medium">Company Name</label>
                  <input
                    name="company.name"
                    value={formData.company.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
                </div>

                <div className="w-full md:w-[48%]">
                  <label className="block mb-1 font-medium">Company Website</label>
                  <input
                    name="company.website"
                    value={formData.company.website}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
                </div>

                <div className="w-full md:w-[48%]">
                  <label className="block mb-1 font-medium">Company Location</label>
                  <input
                    name="company.location"
                    value={formData.company.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-white" />
                </div>

                <div className="w-full">
                  <label className="block mb-2 font-semibold">Company Logo</label>
                  {formData.company.logoUrl && (
                    <img src={formData.company.logoUrl} alt="Company Logo" className="w-24 h-24 object-cover rounded-md mb-3" />
                  )}
                  <label
                    htmlFor="companyLogo"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 cursor-pointer">
                    {formData.company.logoUrl ? 'Change Logo' : 'Upload Company Logo'}
                  </label>
                  <input
                    type="file"
                    id="companyLogo"
                    name="company.logoUrl"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-300 dark:border-neutral-700">
            <Link
              to="/profile"
              className="px-5 py-2.5 border border-gray-400 dark:border-neutral-500 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition">
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
