import React from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Setting = () => {
    
    const { logout } = useAuth()
    ;
    const handleClick = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    }
  return (
    <div className='h-screen w-full'>
      <button onClick={() => handleClick()} className='bg-white p-4'>Logout</button>
    </div>
  )
}

export default Setting
