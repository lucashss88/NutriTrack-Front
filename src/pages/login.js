import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/NT2.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from "../hooks/useAuth";
import Backbutton from '../components/backbutton';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

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
        <div>
            <Backbutton/>
            <div className="logo-login">
                <img src={logo} className='logo' alt='Logo' />
                <p>Faça o Login no NutriTrack</p>
            </div>
            <div className='App-login'>
                <div className='login'>
                    <form onSubmit={handleLogin}>
                        <div className='block-form label-login'>
                            <label>Usuário</label>
                            <input
                                className='input-login'
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-login'>
                            <label>Senha</label>
                            <input
                                className='input-login'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className='login-button'>Login</button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Login;

