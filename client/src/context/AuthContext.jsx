import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fetchCalled = useRef(false);

    useEffect(() => {
        const fetchUser = async () => {
            if(fetchCalled.current) return;
            fetchCalled.current = true;

            const token = localStorage.getItem('token');
            if (!token) {
            setLoading(false);
            return;
            }
            
            try {
                const response = await api.get('/auth/profile');
                setUser(response.data.user);
            } catch (error) {
                console.error("Authorization failed", error.response?.data || error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            navigate('/login');
        }
    }
    
    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);