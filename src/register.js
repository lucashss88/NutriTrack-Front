import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images/NT2.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const voltar = async () => {
        navigate('/');
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/register', { username, password, role });
            alert('Registration successful! Please login.');
            setUsername('');
            setPassword('');
            setRole('patient');
        } catch (err) {
            console.error('Error registering:', err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <img src={logo} className='logo'/>
            {error && <p className="error">{error}</p>}
            <div className='register'>
                <form onSubmit={handleSubmit}>
                    <div className='block-form label-register'>
                        <label>Usuário</label>
                        <input
                            placeholder="Usuário"
                            className='input-register'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='block-form label-register'>
                        <label>Senha</label>
                        <input
                            placeholder="Senha"
                            className='input-register'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='block-form label-register'>
                        <label>Tipo de Usuário</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className='input-register'>
                            <option value="patient">Paciente</option>
                            <option value="nutricionist">Nutricionista</option>
                        </select>
                    </div>
                    <button type="submit" className='register-button'>Registrar</button>
                </form>
            </div>
            <h3 onClick={voltar} className='voltar txt-center'>Voltar</h3>
        </div>
    );
};

export default Register;
