import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { role, logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const handleMenuToggle = () => {
        document.querySelector('.navbar-links-mobile').classList.toggle('active');
    }

    const handleUserMenuToggle = () => {
        document.querySelector('.user-menu-mobile').classList.toggle('active');
    }

    return (
        <header className="navbar-container">
            <div className="navbar-logo">
                <a href="/home" className="navbar-title">NutriTrack</a>
                <button className="navbar-toggle" onClick={handleMenuToggle}><i className="bi bi-list"></i></button>
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
                <button className="navbar-link" onClick={handleUserMenuToggle}>
                    {user?.username || 'Usuário'}
                </button>
            </nav>
            <nav className="navbar-links-mobile">
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
                <a className='navbar-link' href='/edit-profile'>Editar Usuário</a>
                <button className='navbar-link logout' onClick={handleLogout}>Sair</button>
            </nav>
            <nav className="user-menu-mobile">
                <a href='/edit-profile'>Editar Usuário</a>
                <Link to="/" className='logout' onClick={handleLogout}>Sair</Link>
            </nav>
        </header>
    );
};

export default Navbar;