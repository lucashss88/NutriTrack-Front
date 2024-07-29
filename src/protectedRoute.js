import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { role, loading } = useAuth();

    // console.log('Role in ProtectedRoute:', role);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;


