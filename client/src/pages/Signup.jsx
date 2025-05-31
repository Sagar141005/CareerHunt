import { RiUserLine } from '@remixicon/react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios';

const Signup = () => {
    const [ role, setRole ] = useState("jobseeker");
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState(""); 
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await api.post('/auth/signup', {
                name,
                email,
                password,
                role
            });

            console.log("Signup successfull", response.data);

            navigate('/login');
            
        } catch (error) {
            console.error("Signup failed", error.response?.data || error.message);
        }
    }
  return (
    <div className='w-full h-screen flex'>
      <div className='flex flex-col items-center p-auto flex-1 bg-white'>
        <div className='m-auto flex flex-col items-center gap-6'>
            <h1 className='text-shadow-2xs text-3xl font-extrabold'>SIGN UP</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div>
                        <label htmlFor="role">Select your role:</label>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2 font-light'>
                                <input 
                                type='radio'
                                name='role'
                                id='jobseeker'
                                value='jobseeker'
                                checked={role === 'jobseeker'}
                                onChange={(e) => setRole(e.target.value)}
                                />
                                <span>Job Seeker</span>
                            </label>
                            <label className='flex items-center gap-2 font-light'>
                                <input 
                                type='radio'
                                name='role'
                                id='recruiter'
                                value='recruiter'
                                checked={role === 'recruiter'}
                                onChange={(e) => setRole(e.target.value)}
                                />
                                <span>Recruiter</span>
                            </label>
                        </div>
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="name">Full Name<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-300  px-4 w-60 py-2 rounded-lg text-black' 
                        type='text' 
                        name='name'
                        id='name'
                        placeholder='Username'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required/>
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="email">Email<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-300 px-4 w-60 py-2 rounded-lg text-black' 
                        type='email'
                        name='email'
                        id='email' 
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="password">Password<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-300  px-4 w-60 py-2 rounded-lg text-black' 
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                    </div>
                    <button 
                    type='submit'
                    className='bg-gradient-to-br from-blue-300 to-blue-700 p-4 rounded-2xl text-white font-bold text-lg mt-4 shadow-md hover:shadow-xl'>
                        Sign Up
                    </button>
                </form>
                <p>Already have an account? <Link className='text-blue-800' to='/login'>Login</Link></p>
            </div>
      </div>
      <div className='flex-1'>
            <img className='w-full h-full object-cover' src="/signup.png" alt="" />
      </div>
    </div>
  )
}

export default Signup
