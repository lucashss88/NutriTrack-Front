import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images/NT2.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backbutton from './components/backbutton';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');
    const [nutricionistId, setNutricionistId] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [nutricionists, setNutricionists] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = process.env.NEXT_PUBLIC_API_URL

    
    useEffect(() => {
        const fetchNutricionists = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/nutricionists`);
                setNutricionists(response.data);
            } catch (err) {
                console.error('Error fetching nutricionists:', err);
            }
        };

        fetchNutricionists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/api/auth/register', {
                username,
                password,
                role,
                name,
                nutricionistId,
                weight: role === 'patient' ? weight : null,
                height: role === 'patient' ? height : null,
                age: role === 'patient' ? age : null
            });
            toast.success('Usuário registrado com sucesso. Realize o Login!');
            setUsername('');
            setPassword('');
            setName('');
            setRole('patient');
            setNutricionistId('');
            setWeight('');
            setHeight('');
            setAge('');
            navigate('/');
        } catch (err) {
            console.error('Error registering:', err);
            setError('Erro no registro. Tente novamente!');
        }
    };

    return (
        <div>
            <Backbutton/>
            <div className="logo-register">
                <img src={logo} className='logo'/>
                <p>Registre-se no NutriTrack</p>
            </div>
            <div className="register-container">
                {error && <p className="error">{error}</p>}
                <div className='register'>
                    <form onSubmit={handleSubmit}>
                        <div className='block-form label-register'>
                            <label>Usuário</label>
                            <input
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
                                className='input-register'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Nome</label>
                            <input
                                className='input-register'
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                        {role === 'patient' && (
                            <>
                                <div className='block-form label-register'>
                                    <label>Nutricionista</label>
                                    <select
                                        value={nutricionistId}
                                        onChange={(e) => setNutricionistId(e.target.value)}
                                        className='input-register'
                                    >
                                        <option value="">Selecione um nutricionista</option>
                                        {nutricionists.map(nutricionist => (
                                            <option key={nutricionist.id} value={nutricionist.id}>
                                                {nutricionist.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='block-form label-register'>
                                    <label>Peso (kg)</label>
                                    <input
                                        className='input-register'
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='block-form label-register'>
                                    <label>Altura (m)</label>
                                    <input
                                        className='input-register'
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='block-form label-register'>
                                    <label>Idade</label>
                                    <input
                                        className='input-register'
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className='register-button'>Registrar</button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Register;
