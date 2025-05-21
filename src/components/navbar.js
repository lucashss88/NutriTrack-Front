import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="navbar-container">
            <div className="navbar-logo">
                <a href="/home" className="navbar-title">NutriTrack</a>
            </div>
            <nav className="navbar-links">
                {role === 'nutricionist' && (
                    <>
                        <a href="/nutricionist/diets" className="navbar-link">Listar Dietas</a>
                        <a href="/listfoods" className="navbar-link">Listar Alimentos</a>
                        <a href="/listpatients" className="navbar-link">Listar Pacientes</a>
                        <a href="/diet-form" className="navbar-link">Criar Dieta</a>
                        <a href="/food-form" className="navbar-link">Criar Alimento</a>
                    </>
                )}
                {role === 'patient' && (
                    <>
                        <a href="/patient/diets" className="navbar-link">Listar Dietas</a>
                    </>
                )}
                <a href="/" onClick={handleLogout} className="navbar-link logout">Sair</a>
            </nav>
        </header>
    );
};

export default Navbar;