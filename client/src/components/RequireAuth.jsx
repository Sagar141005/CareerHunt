import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';

const RequireAuth = ({ children }) => {
    const { user, loading} = useAuth();

    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <MoonLoader color="#3B82F6" size={40} />
          </div>
        );
    }  

    if(!user) {
        return <Navigate to="/login" replace />
    }

  return children;
}

export default RequireAuth;
