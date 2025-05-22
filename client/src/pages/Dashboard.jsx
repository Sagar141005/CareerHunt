import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import UserDashboard from './UserDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import { useEffect } from 'react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) {
        return <p>Loading...</p>
    }

    if(user.role === 'jobseeker') {
        return <UserDashboard />
    }

    if(user.role === 'recruiter') {
        return <RecruiterDashboard />
    }
    
  return (
   <p>Invalid user role</p>
  )
}

export default Dashboard
