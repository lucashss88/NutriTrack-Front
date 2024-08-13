import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Backbutton from './components/backbutton';

const ListPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = loadToken();
                const response = await axios.get('http://localhost:3001/api/auth/patients', {
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
    if (patients.length === 0) return <p>Nenhum paciente encontrado.</p>;

    return (
        <div>
            <Backbutton/>
            <div className="list-foods">
                <h1>Lista de Pacientes</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo de usuário</th>
                        <th>Idade</th>
                        <th>Peso</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.username}</td>
                            <td>{patient.role}</td>
                            <td>{patient.age}</td>
                            <td>{patient.weight}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default ListPatients;
