import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const EditUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/api/auth/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(response.data.user);
            } catch (error) {
                toast.error('Erro ao carregar dados');
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.put('/api/auth/me', user, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Perfil atualizado!');
            navigate('/home');
        } catch (error) {
            toast.error('Erro ao atualizar perfil');
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-1 py-md-3">
            <div className="dietform-container shadow-lg p-md-3 pt-md-4 p-1 mt-1 mt-md-5">
                <h2>Editar Perfil</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={user.username || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nome:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={user.name || ''}
                            onChange={handleChange}
                        />
                    </div>
                    {user.role === 'patient' && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Peso (kg):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="weight"
                                    value={user.weight || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Altura (cm):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="height"
                                    value={user.height || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Idade:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="age"
                                    value={user.age || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <button type="submit" className="btn btn-light rounded-2 border-light">
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditUser;