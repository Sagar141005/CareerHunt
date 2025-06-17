import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RecruiterPannel from '../components/RecruiterPannel';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/auth/change-password', passwords);
      alert('Password updated successfully.');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/delete');
      await logout();
      navigate('/signup');
    } catch (error) {
      alert('Could not delete account');
    }
  };

  return (
    <div className="w-full h-screen bg-[#F2F2F2] flex">
      {user.role === 'recruiter' && (
          <RecruiterPannel />
      )}
      <div className="w-full p-8 space-y-12">
        <div>
          <h2 className="text-2xl font-extrabold">Settings</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your preferences</p>
        </div>
    
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Theme</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <span className="text-gray-700">
              {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <label htmlFor="toggle" className="relative inline-block w-14 h-8 cursor-pointer">
              <input
                id="toggle"
                type="checkbox"
                className="peer opacity-0 w-0 h-0"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)} />
              <span className="absolute left-0 top-0 w-14 h-8 bg-gray-300 rounded-full transition-colors peer-checked:bg-blue-600"></span>
              <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></span>
            </label>
          </div>
        </div>
    
        <form onSubmit={handlePasswordChange}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Change Password</h3>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-50 bg-white" />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-50 bg-white" />
            <p className="text-xs text-gray-400">Make sure it’s at least 8 characters.</p>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
              Update Password
            </button>
          </div>
        </form>
    
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-2">Need a break?</p>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer">
            Logout
          </button>
        </div>
    
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:underline cursor-pointer">
            Delete your account
          </button>
    
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 max-w-sm w-full shadow-lg">
                <p className="text-sm text-red-600 mb-4 font-semibold">
                  This action is irreversible.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer">
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
    
  );
};

export default Settings;
