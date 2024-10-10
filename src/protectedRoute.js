import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>; // Ou um spinner de carregamento
    }

    if (!user || !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />; // Redireciona para a página principal de login/registro
    }

    return children;
};

export default ProtectedRoute;



