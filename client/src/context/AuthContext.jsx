import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/auth/profile');
                setUser(response.data.user);
            } catch (error) {
                console.error("Authorization failed", error.response?.data || error.message);
                setUser(null);
                if(error.response?.status === 401) {
                    navigate('/login');
                }
            }
        }

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await api.get('/auth/logout');
        } finally {
            setUser(null);
            navigate('/login');
        }
    }
    
    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);