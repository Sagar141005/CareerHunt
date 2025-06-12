import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'

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
    <div className='w-full min-h-screen bg-[#F9F9F9] overflow-y-hidden'>
      <div className='w-full h-full px-12 py-8 flex flex-col gap-6 items-center'>
        <h2 className='text-4xl font-bold'>Edit Profile</h2>
            <div className='w-2xl h-full px-12 py-8 bg-neutral-200 rounded-lg flex justify-center'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <label className='flex flex-col gap-1'>
                        <span className='text-xl font-medium'>Name</span>
                        <input 
                        name='name'
                        className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                        type="text" 
                        value={formData.name}
                        onChange={handleChange} />
                    </label>
                    <label className='flex flex-col gap-1'>
                        <span className='text-xl font-medium'>Profile Picture</span>
                        <input 
                        name='profilePic'
                        className='w-xl h-10 p-2 bg-white rounded-lg shadow-md' 
                        type="file" 
                        accept='image/*'
                        onChange={handleImage}
                         />
                        {formData.profilePic && <img src={formData.profilePic} alt="Profile" className="h-16 w-16 mt-2 object-contain" />}
                    </label>
                    <label className='flex flex-col gap-1'>
                        <span className='text-xl font-medium'>Bio</span>
                        <input 
                        name='bio'
                        className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                        type="text"
                        value={formData.bio}
                        onChange={handleChange}
                         />
                    </label>
                    <label className='flex flex-col gap-1'>
                        <span className='text-xl font-medium'>Location</span>
                        <input 
                        name='location'
                        className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                        type="text"
                        value={formData.location}
                        onChange={handleChange} />
                    </label>
                    {user.role === 'recruiter' && (
                        <div>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xl font-medium'>Designation</span>
                                <input 
                                name='designation'
                                className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                                type="text"
                                value={formData.designation}
                                onChange={handleChange} />
                            </label>
                            <div className='flex flex-col gap-4'>
                            <h2 className='text-2xl font-medium my-6'>Company Details</h2>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xl font-medium'>Company Name</span>
                                <input 
                                name='company.name'
                                className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                                type="text"
                                value={formData.company.name}
                                onChange={handleChange} />
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xl font-medium'>Company Logo</span>
                                <input 
                                name='company.logoUrl'
                                className='w-xl h-10 p-2 bg-white rounded-lg shadow-md' 
                                type="file" 
                                accept='image/*'
                                onChange={handleImage} />
                                {formData.company.logoUrl && <img src={formData.company.logoUrl} alt="Logo" className="h-16 w-16 mt-2 object-contain" />}
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xl font-medium'>Website Link</span>
                                <input 
                                name='company.website'
                                className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                                type="text"
                                value={formData.company.website}
                                onChange={handleChange} />
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xl font-medium'>Location</span>
                                <input 
                                name='company.location'
                                className='w-xl h-10 p-4 bg-white rounded-lg shadow-md' 
                                type="text"
                                value={formData.company.location}
                                onChange={handleChange} />
                            </label>
                        </div>
                        </div>
                        
                    )}
                    <div className='flex items-center gap-8 mt-6'>
                        <Link to='/profile' className='text-lg border-[2px] border-black px-7 py-3 rounded-full'>Cancel</Link>
                        <button type='submit' className='text-lg bg-blue-600 text-white px-7 py-3 rounded-full'>Update</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>
  )
}

export default EditProfile
