import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../backbutton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import DownloadModal from '../downloadModal';

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
      <div>
        <BackButton />
        <h1>Dietas dos Pacientes</h1>
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Data de Início</th>
              <th>Data Final</th>
              <th>Refeições</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {diets.map(diet => (
              <tr key={diet.id}>
                <td>{diet.patient?.username || 'Paciente não encontrado'}</td>
                <td>{new Date(diet.startDate).toLocaleDateString()}</td>
                <td>{new Date(diet.endDate).toLocaleDateString()}</td>
                <td>
                    {diet.Meals && diet.Meals.length > 0 ? (
                        diet.Meals.map(meal => (

                            <div key={meal.id}>
                                <strong>{meal.type}</strong>:
                                {meal.Food && meal.Food.length > 0 ? meal.Food.map(food => (
                                    <div key={food.id}>
                                        {food.name} ({food.MealFood.quantity}g)
                                    </div>
                                )) : 'Nenhuma comida encontrada'}
                            </div>
                        ))
                    ) : 'Nenhuma refeição encontrada'}
                </td>

                <td>
                  <button onClick={() => handleEditDiet(diet.id)} className="btn-listfood">Editar</button>
                  <button onClick={() => handleViewDiet(diet.id)} className="btn-listfood">Visualizar</button>
                  <button onClick={() => handleDeleteDiet(diet.id)} className="btn-listfood">Deletar</button>
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

export default ListDietsForNutricionist;
