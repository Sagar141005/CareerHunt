import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'
import MDEditor from '@uiw/react-md-editor';



const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  };
  

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
            const response = await api.put('auth/profile', formData);

            navigate('/profile');
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    if(loading) {
        return <p>Loading...</p>
    }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#F0F4FF] to-[#E6ECFF] py-12 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-10 border border-neutral-200">
            <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Edit Your Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-12">
            <div>
                <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-6">👤 Personal Info</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white capitalize"
                    placeholder="e.g. John Doe"/>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                    <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="e.g. New York"/>
                </div>

                <div className="sm:col-span-2">
                    <label className="flex flex-col gap-1">
                            <span className="text-xl font-medium">Bio</span>
                            <div className="bg-white rounded-lg shadow-md p-2">
                                <MDEditor
                                value={formData.bio}
                                onChange={(value) => setFormData((prev) => ({ ...prev, bio: value || '' }))}
                                preview="edit"          
                                visibleDragbar={false} 
                                height={400}            
                                enableScroll={false}    
                                fullscreen={false} />
                            </div>
                    </label>
                    </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
                    <input
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={handleImage}
                    className="block w-full text-sm file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                    {formData.profilePic && (
                    <img src={formData.profilePic} alt="Profile" className="mt-3 h-16 w-16 rounded-md border object-cover" />
                    )}
                </div>
                </div>
            </div>

            {user.role === 'recruiter' && (
                <div>
                <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-200 pb-2 mb-6">🏢 Company Info</h2>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                    <input
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="e.g. HR Manager"/>
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                    <input
                        name="company.name"
                        value={formData.company.name}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="e.g. Google"/>
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Website</label>
                    <input
                        name="company.website"
                        value={formData.company.website}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="https://example.com"/>
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Location</label>
                    <input
                        name="company.location"
                        value={formData.company.location}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="e.g. San Francisco"/>
                    </div>

                    <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Logo</label>
                    <input
                        type="file"
                        name="company.logoUrl"
                        accept="image/*"
                        onChange={handleImage}
                        className="block w-full text-sm file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                    {formData.company.logoUrl && (
                        <img src={formData.company.logoUrl} alt="Company Logo" className="mt-3 h-16 w-16 rounded-md border object-contain" />
                    )}
                    </div>
                </div>
                </div>
            )}

            <div className="flex justify-end items-center gap-6 pt-6 border-t border-neutral-300">
                <Link
                to="/profile"
                className="relative inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium bg-white rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-200"
>
                Cancel
                </Link>
                <button
                type="submit"
                className="relative inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-all duration-200 ease-in-out"
>
                Save Changes
                </button>
            </div>
            </form>
        </div>
    </div>


  )
}

export default EditProfile
