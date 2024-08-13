import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext';
import BackButton from '../backbutton';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import DownloadModal from '../downloadModal';

const ListDietsForPatient = () => {
    const [diets, setDiets] = useState([]);
    const { user } = useAuth();
    const patientId = user.id;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDiet, setSelectedDiet] = useState(null);  // Nova linha para armazenar a dieta selecionada

    useEffect(() => {
        const fetchDiets = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/diets/patient/${patientId}`, {
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

    const handleEditDiet = (dietId) => {
        navigate(`/edit-diet-patient/${dietId}`);
    };

    const generatePDF = (diet) => {
        const doc = new jsPDF();

        doc.text('Relatório de Dieta', 20, 10);

        // Tabela de Refeições e Alimentos
        const columns = ["Refeição", "Alimento", "Quantidade"];
        const rows = [];

        diet.Meals.forEach((meal) => {
            meal.Food.forEach((mealFood) => {
                rows.push([meal.type, mealFood.name, `${mealFood.MealFood.quantity}g`]);
            });
        });

        doc.autoTable(columns, rows, { startY: 20 });

        doc.save('relatorio_dieta.pdf');
    };

    const generateDOCX = (diet) => {
        if (!diet || !diet.Meals) {
            console.error("Dieta ou refeições não estão disponíveis.");
            return;
        }

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        text: "Relatório de Dieta",
                        heading: HeadingLevel.TITLE,
                    }),
                    new Table({
                        rows: diet.Meals.map((meal) =>
                            new TableRow({
                                children: meal.Food.map((mealFood) =>
                                    new TableCell({
                                        children: [new Paragraph(`${meal.type}: ${mealFood.name} - ${mealFood.MealFood.quantity}g`)],
                                    })
                                ),
                            })
                        ),
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                    }),
                ],
            }],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "relatorio_dieta.docx");
        }).catch((error) => {
            console.error("Erro ao gerar o arquivo DOCX:", error);
        });
    };

    const handleDownloadClick = (diet) => {
        setSelectedDiet(diet); // Armazena a dieta selecionada
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
        <div>
            <BackButton />
            <h1>Dietas do Paciente</h1>
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
                                        </div>
                                    )) : 'Nenhuma comida encontrada'}
                                    </div>
                                ))
                            ) : 'Nenhuma refeição encontrada'}
                        </td>
                        <td>
                            <button onClick={() => handleViewDiet(diet.id)} className="btn-listfood">Visualizar</button>
                            <button onClick={() => handleEditDiet(diet.id)} className="btn-listfood">Editar</button>
                            <button onClick={() => handleDownloadClick(diet)} className="btn-listfood">Download</button>
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
