import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { user, setUser } = useAuth();

  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) {
      setPasswordError("Password must be at least 8 characters.");
    } else if (!hasUpperCase) {
      setPasswordError("Password must contain an uppercase letter.");
    } else if (!hasNumber) {
      setPasswordError("Password must contain a number.");
    } else {
      setPasswordError("");
    }
  };


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });
      localStorage.setItem('token', response.data.token); 
      setUser(response.data.user);
      setHasSubmitted(true); 
      toast.success("Login successfull! 🎉");
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login failed.";
      toast.error(msg);
    }
  }

  useEffect(() => {
    if (hasSubmitted && user) {
      navigate('/dashboard');
    }
  }, [hasSubmitted, user, navigate]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center animated-gradient-bg relative px-4">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-xl transform transition-all duration-500 hover:scale-102">
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
              onChange={handlePasswordChange}
              placeholder="Your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"  />
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={!!passwordError}
            className={`w-full py-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-xl
              shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-2xl active:scale-95 
              ${!!passwordError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            Login
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-700 mb-4 font-semibold">Or login with</p>
          <div className="flex justify-center gap-6">
            {[
              { src: '/Google-icon.svg', alt: 'Google', provider: 'google' },
              { src: '/Linkedin-icon.svg', alt: 'LinkedIn', provider: 'linkedin' },
              { src: '/Github-icon.svg', alt: 'GitHub', provider: 'github' }
            ].map(({ src, alt, provider }) => (
              <button
                key={alt}
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
                }}
                className="p-3 rounded-full border border-gray-300 bg-white/80 hover:shadow-lg hover:scale-110 active:scale-95
                  transition-transform cursor-pointer"
                aria-label={`Login with ${alt}`}>
                <img src={src} alt={alt} className="w-6 h-6" loading='lazy' />
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6">
          New here?{' '}
          <Link to="/signup" className="text-blue-700 hover:underline cursor-pointer">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login;
