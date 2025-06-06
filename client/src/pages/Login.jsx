import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {

  const { user, setUser } = useAuth();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      console.log("Login response:", response.data.user);
      setUser(response.data.user);
      setHasSubmitted(true);

    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    if (hasSubmitted && user) {
      navigate('/dashboard');
    }
  }, [hasSubmitted, user, navigate]);

  return (
    <div className='w-full h-screen flex'>
      <div className='flex flex-col items-center p-auto flex-1 bg-white'>
        <div className='m-auto flex flex-col items-center gap-6'>
            <h1 className='text-shadow-2xs text-3xl font-extrabold'>LOGIN</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <div className='flex flex-col items-start gap-1'>
                        <label htmlFor="email">Email<span className='text-red-600'>*</span></label>
                        <input 
                        className='bg-gradient-to-r from-blue-200 to-blue-300  px-4 w-60 py-2 rounded-lg text-black' 
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
                    className='bg-gradient-to-br from-blue-300 to-blue-700 p-4 rounded-2xl text-white font-bold text-lg mt-4 shadow-md hover:shadow-lg'>
                      Login
                    </button>
                </form>
                <p>New user? <Link className='text-blue-800' to='/signup'>Create an Account</Link></p>
            </div>
      </div>
      <div className='flex-1'>
            <img className='w-full h-full object-cover' src="/signup.png" alt="" />
      </div>
    </div>
  )
}

export default Login
