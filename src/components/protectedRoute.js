import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user || !allowedRoles.includes(role)) {
        console.log("Rota não autorizada.");
        return <Navigate to="/" replace />;
    }

    return children;
    // return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;



