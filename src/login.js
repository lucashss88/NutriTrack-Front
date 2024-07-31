import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images/NTBW.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './authContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const voltar = () => {
        navigate('/');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://nutri-track-front.vercel.app/api/auth/login', {
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
                toast.error(errorData.msg || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Login failed. Please try again.');
        }
    };

    return (
        <div className='App-login'>
            <img src={logo} className='logo' alt='Logo' />
            <div className='login'>
                <form onSubmit={handleLogin}>
                    <div className='block-form label-login'>
                        <label>Username</label>
                        <input
                            className='input-login'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='block-form label-login'>
                        <label>Password</label>
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
            <h3 onClick={voltar} className='voltar'>VOLTAR</h3>
        </div>
    );
};

export default Login;

