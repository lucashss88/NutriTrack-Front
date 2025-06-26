import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Backbutton from '../backbutton';
import { calculateIMC, getIMCCategory } from './calcIMC';

const ListPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadToken = () => {
        return localStorage.getItem('token');
    };

    const noPatients = () => {
        if (patients.length === 0) {
            return <p>Nenhum paciente encontrado.</p>;
        }
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = loadToken();
                const response = await api.get('/api/auth/patients', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setPatients(response.data);
                console.log(patients)
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Error fetching patients');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;


    return (
        <div className="p-3 fs-6">
            <div>
                <h1 className="fs-2">Lista de Pacientes</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo de usuário</th>
                        <th>Idade</th>
                        <th>Peso</th>
                        <th>Altura</th>
                        <th>IMC</th>
                        <th>Categoria IMC</th>
                    </tr>
                    </thead>
                    <tbody>
                    {noPatients()}
                    {patients.map((patient) => {
                        const imc = calculateIMC(patient.weight, patient.height);
                        const imcCategory = getIMCCategory(imc);
                        return (
                            <tr key={patient.id}>
                                <td>{patient.username}</td>
                                <td>{patient.role}</td>
                                <td>{patient.age}</td>
                                <td>{patient.weight} kg</td>
                                <td>{patient.height} m</td>
                                <td>{imc}</td>
                                <td>{imcCategory}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default ListPatients;
