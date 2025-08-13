import React, {useState, useEffect} from 'react';
import api from '../services/api';
import {useNavigate} from 'react-router-dom';
import logo from '../assets/images/NTBW.png';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Backbutton from '../components/backbutton';

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


    useEffect(() => {
        const fetchNutricionists = async () => {
            try {
                const response = await api.get('/api/auth/nutricionists');
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
            await api.post('/api/auth/register', {
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
            <div
                className="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                <div className='App shadow-lg p-md-3 pt-md-4 p-1 py-4'>
                    <div className="mb-2 text-center d-block">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <img src={logo} className='logo'/>
                    </div>
                    <div>
                        {error && <p className="error">{error}</p>}
                        <div className='register'>
                            <form onSubmit={handleSubmit}>
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
                                <div className='fs-6'>
                                    <label>Nome</label>
                                    <div className="input-group">
                                        <input
                                            className='input-group-text form-control text-start'
                                            type="text"
                                            value={name}
                                            placeholder="Nome"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-6'>
                                    <label>Tipo de Usuário</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)}
                                            className='input-group form-control'
                                            required
                                    >
                                        <option value="patient">Paciente</option>
                                        <option value="nutricionist">Nutricionista</option>
                                    </select>
                                </div>
                                {role === 'patient' && (
                                    <>
                                        <div className='fs-6'>
                                            <label>Nutricionista</label>
                                            <select
                                                value={nutricionistId}
                                                onChange={(e) => setNutricionistId(e.target.value)}
                                                className='form-control input-group'
                                                required
                                            >
                                                <option value="">Selecione um nutricionista</option>
                                                {nutricionists.map(nutricionist => (
                                                    <option key={nutricionist.id} value={nutricionist.id}>
                                                        {nutricionist.username}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='fs-6'>
                                            <label>Peso (kg)</label>
                                            <div className="input-group">
                                                <input
                                                    className='input-group-text form-control text-start'
                                                    type="text"
                                                    value={weight}
                                                    placeholder="Peso"
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='fs-6'>
                                            <label>Altura (m)</label>
                                            <div className="input-group">
                                                <input
                                                    className='input-group-text form-control text-start'
                                                    type="text"
                                                    value={height}
                                                    placeholder="Altura"
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className='fs-6'>
                                            <label>Idade</label>
                                            <div className="input-group">
                                                <input
                                                    className='input-group-text form-control text-start'
                                                    type="text"
                                                    value={age}
                                                    placeholder="Idade"
                                                    onChange={(e) => setAge(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <button type="submit" className="mt-4 btn btn-light rounded-2 mb-2">Registrar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Register;
