import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);

      (async () => {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user);
          navigate('/dashboard');
        } catch (err) {
          console.error("OAuth profile fetch failed", err);
          navigate('/login');
        }
      })();
    } else {
      navigate('/login');
    }
  }, []);

  return null;
};

export default OAuthCallback;
