import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RecruiterPannel from '../components/RecruiterPannel';
import { RiCloseLine, RiMoonClearFill, RiSunFill } from '@remixicon/react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
  
    // Default to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Logout failed. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/change-password', passwords);
      toast.success('Password updated successfully!');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/delete');
      await logout();
      toast.success('Account deleted. Redirecting to signup.');
      navigate('/signup');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete account.');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col sm:flex-row bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {
        user.role === 'recruiter' ? 
          <RecruiterPannel /> 
            :  
          <Link
            to="/jobs"
            className="hidden sm:flex items-center justify-center h-12 w-12 rounded-full bg-white dark:bg-gray-800 top-4 right-4 shadow-lg cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition absolute">
            <RiCloseLine size={28} />
          </Link>
      }

      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 overflow-auto">
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage your preferences</p>
          </div>

          {/* Theme Toggle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Theme</h3>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700 transition">
              <span className="text-gray-700 flex items-center justify-center gap-3 dark:text-gray-200">
                {darkMode ? <><RiMoonClearFill color='#4F46E5' /> Dark Mode</> : <><RiSunFill color='#FBBF24' /> Light Mode</>}
              </span>
              <label htmlFor="toggle" className="relative inline-block w-14 h-8 cursor-pointer">
                <input
                  id="toggle"
                  type="checkbox"
                  className="peer opacity-0 w-0 h-0"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="absolute left-0 top-0 w-14 h-8 bg-gray-300 dark:bg-neutral-700 rounded-full transition-colors peer-checked:bg-blue-600"></span>
                <span className="absolute left-1 top-1 w-6 h-6 bg-white dark:bg-neutral-300 rounded-full shadow-md transition-transform peer-checked:translate-x-6"></span>
              </label>
            </div>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handlePasswordChange}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500">Make sure it’s at least 8 characters.</p>
              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-neutral-700 mt-8">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Need a break?</p>
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer">
              Logout
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-neutral-700">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:underline cursor-pointer">
              Delete your account
            </button>

            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
                <div className="bg-red-50 dark:bg-neutral-800 p-6 rounded-lg border border-red-200 dark:border-red-500 max-w-sm w-full shadow-xl transition-colors">
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-semibold">
                    This action is irreversible.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer">
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition cursor-pointer">
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
