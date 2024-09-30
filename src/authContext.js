import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'x-auth-token': token,
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.user) {
                        setUser(data.user);
                        setRole(data.user.role);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);


    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        setUser(userData.user);
        setRole(userData.user.role);
        setLoading(false);

        console.log('User set in context:', userData.user); // Log the user set in context
        console.log('Role set in context:', userData.user.role); // Log the role set in context

        toast.success('Usuário logado com sucesso!');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
        toast.info('Usuário deslogado com sucesso!');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
