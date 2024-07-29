import React from 'react';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';

const Logoutbutton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <button onClick={handleLogout} className='lgt-button'>Logout</button>
        </>

    );
};

export default Logoutbutton;