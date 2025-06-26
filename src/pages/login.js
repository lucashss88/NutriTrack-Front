import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../assets/images/NTBW.png';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../hooks/useAuth";
import Backbutton from '../components/backbutton';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                const userData = response.data;
                console.log('Response data:', userData);
                login(userData);
                navigate('/home');
            } else {
                console.error('Error logging in:', response.data);
                toast.error(response.data.msg || 'Erro no Login. Tente novamente!');
            }
        } catch (error) {
            console.error('Error logging in:', error.response ? error.response.data : error);
            toast.error('Erro no Login. Tente novamente!');
        }
    };

    return (
        <>
            <Backbutton/>
            <div className="w-100 h-auto d-flex flex-column justify-content-center align-items-center">
                <div className='App shadow-lg p-md-5'>
                    <div className="mb-2 text-center d-block">
                        <img src={logo} className='logo' alt='Logo'/>
                    </div>
                    <div className='login'>
                        <form onSubmit={handleLogin}>
                            <div className='fs-6'>
                                <label>Usuário</label>
                                <div className="input-group">
                                    <input
                                        className='input-group-text form-control text-start'
                                        type="text"
                                        value={username}
                                        placeholder="Usuário"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className='fs-6'>
                                <label>Senha</label>
                                <div className="input-group">
                                    <input
                                        className='input-group-text form-control text-start'
                                        type="password"
                                        value={password}
                                        placeholder="Senha"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className='mt-4 btn btn-light rounded-2 border-light'>Login</button>
                            <div className="text-center mt-3">
                                <p className="text-light mb-0">
                                    Não tem uma conta?{' '}
                                    <a href="/register" className="link-light fw-semibold">
                                        <i className="bi bi-person-plus me-1"></i>
                                        Criar conta
                                    </a>
                                </p>
                            </div>

                            <div className="d-flex align-items-center my-4">
                                <div className="flex-grow-1 border-top border-light"></div>
                                <span className="mx-3 small">OU</span>
                                <div className="flex-grow-1 border-top border-light"></div>
                            </div>

                            {/* Login Social */}
                            <div className="d-grid gap-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-light d-flex align-items-center justify-content-center"
                                >
                                    <svg className="me-2" width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M44.5 20H24V28.5H35.42C34.78 31.42 32.74 33.72 30.12 35.38V40.75H38.5C43.34 36.36 46 29.58 46 20H44.5Z" fill="#4285F4"/>
                                        <path d="M24 46C30.34 46 35.74 43.96 39.81 40.75L30.12 35.38C27.91 36.87 25.13 37.75 24 37.75C19.74 37.75 16.03 34.98 14.77 31.06L4.5 31.06V36.31C6.9 41.22 14.15 46 24 46Z" fill="#34A853"/>
                                        <path d="M14.77 31.06C14.17 29.35 13.84 27.64 13.84 24C13.84 20.36 14.17 18.65 14.77 16.94L14.77 11.69L4.5 11.69C2.06 16.63 2.06 29.37 4.5 34.31L14.77 31.06Z" fill="#FBBC05"/>
                                        <path d="M24 10.25C26.54 10.25 28.84 11.11 30.72 12.87L38.79 4.75C35.74 1.76 30.34 0 24 0C14.15 0 6.9 4.78 4.5 9.78L14.77 16.94C16.03 13.02 19.74 10.25 24 10.25Z" fill="#EA4335"/>
                                    </svg>
                                    Continuar com Google
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-light d-flex align-items-center justify-content-center"
                                >
                                    {/* Ícone do Facebook em SVG */}
                                    <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.505 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                    Continuar com Facebook
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

