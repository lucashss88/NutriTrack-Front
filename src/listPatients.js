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

    const noPatients = () => {
        if (patients.length === 0) {
            return <p>Nenhum paciente encontrado.</p>;
        }
    }

    const calculateIMC = (weight, height) => {
        const imc = weight / (height * height);
        return imc.toFixed(2);
    };

    const getIMCCategory = (imc) => {
        if (imc < 18.5) return 'Abaixo do peso';
        if (imc >= 18.5 && imc < 24.9) return 'Peso normal';
        if (imc >= 25 && imc < 29.9) return 'Sobrepeso';
        if (imc >= 30) return 'Obesidade';
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
