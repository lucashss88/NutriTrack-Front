import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images/NT2.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './authContext';
import Backbutton from './components/backbutton';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const userData = await response.json();
                console.log('Response data:', userData);
                login(userData); // Use the login function from AuthContext
                navigate('/home');
            } else {
                const errorData = await response.json();
                console.error('Error logging in:', errorData);
                toast.error(errorData.msg || 'Erro no Login. Tente novamente!');
            }
        } catch (error) {
            console.error('Error logging in:', error);
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

