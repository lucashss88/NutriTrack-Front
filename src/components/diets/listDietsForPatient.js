import React, {useEffect, useState} from 'react';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import {useNavigate} from 'react-router-dom';
import 'jspdf-autotable';
import DownloadModal from '../downloadModal';
import {generateDOCX, generatePDF} from "./downloadDiets";

const ListDietsForPatient = () => {
    const [diets, setDiets] = useState([]);
    const {user} = useAuth();
    const patientId = user.id;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const fetchDiets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/diets/patient/${patientId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                console.log(response.data);
                setDiets(response.data);
            } catch (error) {
                console.error('Error fetching diets:', error);
            }
        };

        fetchDiets();
    }, [patientId]);

    const handleViewDiet = (dietId) => {
        navigate(`/view-diet/${dietId}`);
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
            <h1 className="fs-2">Dietas dos Pacientes</h1>
            <table>
                <thead>
                <tr>
                    <th scope="col">Data de Início</th>
                    <th scope="col">Data Final</th>
                    <th scope="col">Refeições</th>
                    <th scope="col" className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {diets.map(diet => (
                    <tr key={diet.id}>
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
                                {/*<button onClick={() => handleEditDiet(diet.id)} className="btn-listfood">Editar</button>*/}
                                <button onClick={() => handleViewDiet(diet.id)}
                                        className="btn-nutritrack mx-1">Visualizar
                                </button>
                                <button onClick={() => handleDownloadClick(diet)}
                                        className="btn-nutritrack mx-1">Download
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

export default ListDietsForPatient;
