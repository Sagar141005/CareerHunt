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
    <div className="w-full min-h-screen flex justify-center items-center animated-gradient-bg relative">

    <div className="absolute inset-0 bg-black/30"></div>

    <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-xl transform transition-all duration-500 hover:scale-102">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6 select-none">Welcome Back</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email <span className="text-red-600">*</span></label>
            <input 
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password <span className="text-red-600">*</span></label>
            <input 
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-xl
            shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-2xl active:scale-95 cursor-pointer">
            Login
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-700 mb-4 font-semibold">Or login with</p>
          <div className="flex justify-center gap-6">
            {[
              { src: '/Google-icon.svg', alt: 'Google' },
              { src: '/Linkedin-icon.svg', alt: 'LinkedIn' },
              { src: '/Github-icon.svg', alt: 'GitHub' }
            ].map(({ src, alt }) => (
              <button
                key={alt}
                className="p-3 rounded-full border border-gray-300 bg-white/80 hover:shadow-lg hover:scale-110 active:scale-95
                transition-transform cursor-pointer">
                <img src={src} alt={alt} className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6">
          New here?{' '}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;
