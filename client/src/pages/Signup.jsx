import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Signup = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get('role');

  const [role, setRole] = useState(roleFromQuery || 'jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    return "";
  };


  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        role
      });
      toast.success('Account created successfully! 🎉');
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Signup failed.";
      toast.error(msg);
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
        await api.post('/auth/social/preference', { role });
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`
    } catch (error) {
        const msg = error.response?.data?.message || error.message || 'Error storing role before social login';
        toast.error(msg);
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 sm:px-6 animated-gradient-bg relative">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-xl transform transition-all duration-500 hover:scale-102">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6 select-none">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 select-none">
              I am a
            </label>
            <div className="flex gap-4">
              {['jobseeker', 'recruiter'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium border cursor-pointer transition-all duration-300 select-none
                    ${
                      role === r
                        ? 'bg-blue-600 text-white border-blue-700 shadow'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }
                  `}>
                  {r === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 select-none">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 select-none">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 select-none">
              Password <span className="text-red-600">*</span>
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => {
                const val = e.target.value;
                setPassword(val);
                setPasswordError(validatePassword(val));
              }}
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-700 mb-4 font-semibold select-none">Or sign up with</p>
          <div className="flex justify-center gap-6">
            {[
              { src: '/Google-icon.svg', alt: 'Google', provider: 'google' },
              { src: '/Linkedin-icon.svg', alt: 'LinkedIn', provider: 'linkedin' },
              { src: '/Github-icon.svg', alt: 'GitHub', provider: 'github' }
            ].map(({ src, alt, provider }) => (
              <button
                onClick={() => handleSocialLogin(provider)}
                key={alt}
                className="p-3 rounded-full border border-gray-300 bg-white/80 hover:shadow-lg hover:scale-110 active:scale-95
                           transition-transform cursor-pointer"
                aria-label={`Sign up with ${alt}`}>
                <img src={src} alt={alt} className="w-6 h-6" loading='lazy' />
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6 select-none">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
