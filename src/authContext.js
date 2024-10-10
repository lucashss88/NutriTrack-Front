import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            'x-auth-token': token,
                        },
                    });
                    const data = await response.json();
                    if (data.user) {
                        setUser(data.user);
                        setRole(data.user.role);
                    }
                } catch (error) {
                    console.error('Erro ao buscar o usuário:', error);
                    setUser(null);
                    setRole(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [API_URL]);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        setUser(userData.user);
        setRole(userData.user.role);
        setLoading(false);

        console.log('Usuário logado:', userData.user);
        console.log('Role:', userData.user.role);

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