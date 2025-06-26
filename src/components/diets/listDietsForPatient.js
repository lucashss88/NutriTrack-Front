import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from "../../hooks/useAuth";
import BackButton from '../backbutton';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import DownloadModal from '../downloadModal';
import {generateDOCX, generatePDF} from "./downloadDiets";

const ListDietsForPatient = () => {
    const [diets, setDiets] = useState([]);
    const { user } = useAuth();
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
                    <th>Data de Início</th>
                    <th>Data Final</th>
                    <th>Refeições</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {diets.map(diet => (
                    <tr key={diet.id}>
                        <td>{new Date(diet.startDate).toLocaleDateString()}</td>
                        <td>{new Date(diet.endDate).toLocaleDateString()}</td>
                        <td>
                            {diet.Meals && diet.Meals.length > 0 ? (
                                diet.Meals.map(meal => (
                                    <div key={meal.id}>
                                        <strong>{meal.type}</strong>: {meal.Food && meal.Food.length > 0 ? meal.Food.map(food => (
                                        <div key={food.id}>
                                            {food.name} ({food.MealFood.quantity}g)
                                            {food.MealFood.substitutes && food.MealFood.substitutes.length > 0 && (
                                                <div>
                                                    <strong>Substitutos:</strong>
                                                    <ul>
                                                        {food.MealFood.substitutes.map(sub => (
                                                            <li key={sub.id}>{sub.name} ({sub.quantity}g)</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )) : 'Nenhuma comida encontrada'}
                                    </div>
                                ))
                            ) : 'Nenhuma refeição encontrada'}
                        </td>
                        <td>
                            {/*<button onClick={() => handleEditDiet(diet.id)} className="btn-listfood">Editar</button>*/}
                            <button onClick={() => handleViewDiet(diet.id)} className="btn-nutritrack mx-1">Visualizar</button>
                            <button onClick={() => handleDownloadClick(diet)} className="btn-nutritrack mx-1">Download</button>
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
