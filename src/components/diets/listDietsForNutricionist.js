import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import DownloadModal from '../downloadModal';
import {generatePDF, generateDOCX} from './downloadDiets';

const ListDietsForNutricionist = () => {
    const [diets, setDiets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL

    const getNutricionistId = () => {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    };

    useEffect(() => {
        const fetchDiets = async () => {
            try {
                const nutricionistId = getNutricionistId();
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/diets/nutricionist/${nutricionistId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDiets(response.data);
            } catch (error) {
                console.error('Error fetching diets:', error);
            }
        };

        fetchDiets();
    }, []);

    const handleViewDiet = (dietId) => {
        navigate(`/view-diet/${dietId}`);
    };

    const handleEditDiet = (dietId) => {
        navigate(`/edit-diet-nutricionist/${dietId}`);
    };

    const handleDeleteDiet = async (dietId) => {
        if (window.confirm('Tem certeza que deseja deletar esta dieta?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/api/diets/${dietId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                toast.success('Dieta removida com sucesso!');
                setDiets(diets.filter(diet => diet.id !== dietId));
            } catch (error) {
                console.error('Erro ao deletar dieta:', error);
                toast.error('Erro ao deletar dieta. Tente novamente!');
            }
        }
    };

    const handleDownloadClick = (diet) => {
        setSelectedDiet(diet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDownloadPDF = () => {
        if (selectedDiet) {
            generatePDF(selectedDiet);
        }
        setIsModalOpen(false);
    };

    const handleDownloadDOCX = () => {
        if (selectedDiet) {
            generateDOCX(selectedDiet);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-3 fs-6">
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="fs-2">Dietas dos Pacientes</h1>
                <div className="justify-content-end">
                    <button className="btn-nutritrack" onClick={() => navigate('/diet-form')}>
                        Criar Nova Dieta
                    </button>
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    <th scope="col">Paciente</th>
                    <th scope="col">Data de Início</th>
                    <th scope="col">Data Final</th>
                    <th scope="col">Refeições</th>
                    <th scope="col" className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {diets.map(diet => (
                    <tr key={diet.id}>
                        <td>{diet.patient?.username || 'N/A'}</td>
                        <td>{new Date(diet.startDate).toLocaleDateString()}</td>
                        <td>{new Date(diet.endDate).toLocaleDateString()}</td>
                        <td>
                            {diet.Meals && diet.Meals.length > 0 ? (
                                <ul className="meal-summary-list">
                                    {diet.Meals.map(meal => (
                                        <li key={meal.id}>
                                            <strong>{meal.type}</strong>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="text-muted small">Nenhuma refeição configurada.</span>
                            )}
                        </td>

                        <td className="text-center">
                            <div className="d-md-flex justify-content-center align-items-center">
                                <button onClick={() => handleEditDiet(diet.id)} className="btn-nutritrack mx-1">Editar
                                </button>
                                <button onClick={() => handleViewDiet(diet.id)} className="btn-nutritrack mx-1">Visualizar
                                </button>
                                <button onClick={() => handleDownloadClick(diet)} className="btn-nutritrack mx-1">Download
                                </button>
                                <button onClick={() => handleDeleteDiet(diet.id)} className="btn btn-danger mx-1">Deletar
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <DownloadModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onDownloadPDF={handleDownloadPDF}
                onDownloadDOCX={handleDownloadDOCX}
            />
        </div>
    );
};

export default ListDietsForNutricionist;
