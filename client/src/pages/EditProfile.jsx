import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'
import MDEditor from '@uiw/react-md-editor';
import { RiArrowLeftLine } from '@remixicon/react';

const EditProfile = () => {

    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [ formData, setFormData ] = useState({
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

        if(name.startsWith('company.')) {
            const key = name.split('.')[1];
            if (['name', 'logoUrl', 'website', 'location'].includes(key)) {
                setFormData(prev => ({
                  ...prev,
                  company: {
                    ...prev.company,
                    [key]: value,
                }
            }));
            }
        } else if (['name', 'profilePic', 'bio', 'location', 'designation'].includes(name)) {
              setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImage = async (e) => {
        const { name, files } = e.target;
        if(files.length === 0) return;

        const imageFile = files[0];
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

        try {
            const cloudinaryRes = await fetch(
                import.meta.env.VITE_CLOUDINARY_URL,
                {
                    method: 'POST',
                    body: imageFormData
                }
            );

            const cloudinaryData = await cloudinaryRes.json();
            const uploadedImageURL = cloudinaryData.secure_url;

            if(name === 'company.logoUrl') {
                setFormData(prev => ({
                    ...prev,
                    company: {
                        ...prev.company,
                        logoUrl: uploadedImageURL
                    }
                }));
            } else if(name === 'profilePic') {
                setFormData(prev => ({
                    ...prev,
                    profilePic: uploadedImageURL
                }));
            }
        } catch (error) {
            console.error('Image upload failed:', error);
        }
    }

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

        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.put('auth/profile', formData);
            navigate('/profile');
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    if(loading) {
        return <p>Loading...</p>
    }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] py-12 px-6">
      <Link 
      to='/profile'
      className='absolute flex items-center justify-center h-12 w-12 rounded-full bg-white top-4 left-4 shadow-lg cursor-pointer text-[#ccc] hover:text-black  transition-all duration-200'>
        <RiArrowLeftLine size={30} color='currentColor' />
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-10 border border-neutral-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Edit Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          <div>
            <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-6">👤 Personal Info</h2>

            <div className="flex flex-col gap-6">
                <div className='flex gap-6'>
                    <div className='w-1/2'>
                        <label className="text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white capitalize"
                        placeholder="e.g. John Doe" />
                    </div>

                    <div className='w-1/2'>
                        <label className="text-sm font-semibold text-gray-700 mb-1">Location</label>
                        <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white"
                        placeholder="e.g. New York" />
                    </div>
                </div>
              

              <div className="">
                <label className="flex flex-col gap-1">
                  <span className="text-xl font-medium">Bio</span>
                    <MDEditor
                      value={formData.bio}
                      onChange={(value) => setFormData((prev) => ({ ...prev, bio: value || '' }))}
                      preview="edit"          
                      visibleDragbar={false} 
                      height={400}            
                      enableScroll={false}    
                      fullscreen={false}  />
                </label>
              </div>

              <div className="">
                <label className="text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
                <div className="w-full mt-4">
                  {formData.profilePic && (
                    <div className="mb-3 w-24 h-24 rounded-md border overflow-hidden">
                      <img
                        src={formData.profilePic}
                        alt="Profile Preview"
                        className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label
                    htmlFor="profilePic"
                    className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition w-max">
                    <span className='text-md'>{formData.profilePic ? 'Change Profile Picture' : 'Upload Profile Picture'}</span>
                  </label>
                  <input
                    id="profilePic"
                    name="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden" />
                </div>
              </div>
            </div>
          </div>

          {user.role === 'recruiter' && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-6">🏢 Company Info</h2>
              <div className="flex flex-col gap-6">
                <div className='flex gap-6'>
                    <div className='w-1/2'>
                    <label className="text-sm font-semibold text-gray-700 mb-1">Designation</label>
                    <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white"
                        placeholder="e.g. HR Manager" />
                    </div>

                    <div className='w-1/2'>
                    <label className="text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                    <input
                        name="company.name"
                        value={formData.company.name}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white"
                        placeholder="e.g. Google" />
                    </div>
                </div>
                
                <div className="flex gap-6">
                    <div className='w-1/2'>
                    <label className="text-sm font-semibold text-gray-700 mb-1">Company Website</label>
                    <input
                        name="company.website"
                        value={formData.company.website}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white"
                        placeholder="https://example.com" />
                    </div>

                    <div className='w-1/2'>
                    <label className="text-sm font-semibold text-gray-700 mb-1">Company Location</label>
                    <input
                        name="company.location"
                        value={formData.company.location}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 bg-white"
                        placeholder="e.g. San Francisco" />
                    </div>
                </div>
                

                <div className="">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
                  <div className="w-full mt-4">
                    {formData.company.logoUrl && (
                      <div className="mb-3 w-24 h-24 rounded-md border overflow-hidden">
                        <img
                          src={formData.company.logoUrl}
                          alt="Company Logo Preview"
                          className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label
                      htmlFor="companyLogo"
                      className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2 bg-blue-600 text-white font-medium rounded-full shadow hover:bg-blue-700 transition w-max">
                      <span className='text-md'>{formData.company.logoUrl ? 'Change Logo' : 'Upload Company Logo'}</span>
                    </label>
                    <input
                      id="companyLogo"
                      name="company.logoUrl"
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="hidden" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end items-center gap-6 pt-6 border-t border-neutral-300">
            <Link
              to="/profile"
              className="relative inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium bg-white rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md  transition-all duration-200 cursor-pointer">
              Cancel
            </Link>
            <button
              type="submit"
              className="relative inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200 ease-in-out cursor-pointer">
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProfile
