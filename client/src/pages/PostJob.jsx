import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'
import { useAuth } from '../context/AuthContext';

const PostJob = () => {
    const { user, loading } = useAuth();

    const [ company, setCompany ] = useState('');
    const [ companyLogo, setCompanyLogo ] = useState(null);
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ type, setType ] = useState('');
    const [ deadline, setDeadline ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !user) {
            navigate('/login');
        }
    }, [ user, loading, navigate ]);

    if(loading) {
        return <p>Loading...</p>
    }

    if(!user) {
        navigate('/login');
        return null;
    }

    if(user.role === 'jobseeker') {
        navigate('/dashboard');
        console.error("Not Authenticated");
        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let uploadedImageURL = '';

        if(companyLogo) {
            const imageFormData = new FormData();
            imageFormData.append('file', companyLogo);
            imageFormData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET);

            const cloudinaryRes = await fetch(
                import.meta.env.VITE_CLOUDINARY_URL,
                {
                    method: 'POST',
                    body: imageFormData
                }
            );

            const cloudinaryData = await cloudinaryRes.json();
            uploadedImageURL = cloudinaryData.secure_url;
        }


        try {
            const response = await api.post('/job-posts/create', {
                company,
                companyLogo: uploadedImageURL,
                title,
                description,
                location,
                type,
                deadline
            });

            navigate('/dashboard');
            
        } catch (error) {
            console.error(error.response?.data || error.message);
        }

    }


  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center gap-10'>
        <h1 className='text-4xl font-extrabold text-[#1A1C1F]'>Create Job Post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col items-start gap-2'>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="company">
                    Company Name<span className='text-red-600'>*</span>
            </label>
            <input 
                className='bg-white rounded-lg text-black text-sm w-3xl py-2 px-4 border-1 border-neutral-300' 
                type="text"
                placeholder='ABC company'
                name='company'
                id='company'
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required />
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="companyLogo">
                    Company Logo<span className='text-red-600'>*</span>
            </label>
            <input 
                className='bg-white rounded-lg text-black text-sm  w-3xl py-2 px-4 border-1 border-neutral-300' 
                type="file"
                accept='image/*'
                name='companyLogo'
                id='companyLogo'
                onChange={(e) => setCompanyLogo(e.target.files[0])}
                required />
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="title">
                    Title<span className='text-red-600'>*</span>
            </label>
            <input 
                className='bg-white rounded-lg text-black text-sm  w-3xl py-2 px-4 border-1 border-neutral-300' 
                type="text"
                name='title'
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required />
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                    htmlFor="description">
                        Description<span className='text-red-600'>*</span>
                </label>
            <textarea 
                className='bg-white rounded-lg text-black text-sm  w-3xl py-2 px-4 border-1 border-neutral-300 resize-none' 
                rows={6}
                name='description'
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required />
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="location">
                    Location
            </label>
            <input 
                className='bg-white rounded-lg text-black text-sm  w-3xl py-2 px-4 border-1 border-neutral-300' 
                type="text"
                name='location'
                id='location'
                value={location}
                onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="jobType">
                    Job Type<span className='text-red-600'>*</span>
            </label>
            <select 
                className='bg-white rounded-lg text-black w-3xl py-2 px-4 border-1 border-neutral-300' 
                name="type" 
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}>
                    <option value="">Please choose an option</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
            </select>
        </div>
        <div className='flex flex-col items-start gap-1'>
            <label 
                className='text-md font-medium text-neutral-900' 
                htmlFor="deadline">
                    Deadline<span className='text-red-600'>*</span>
            </label>
            <input 
                className='bg-white rounded-lg text-black w-60 py-1 px-4 border-1 border-neutral-300' 
                type="date" 
                name='deadline'
                id='deadline'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}/>
        </div>
        <div className=''>
            <button 
                type='submit' 
                className='mt-4 bg-black text-white px-8 py-3 rounded-lg'>
                    Post
            </button>
        </div>
      </form>
    </div>
  )
}

export default PostJob
