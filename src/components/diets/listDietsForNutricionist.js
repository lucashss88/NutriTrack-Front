import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../backbutton';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListDietsForNutricionist = () => {
    const [diets, setDiets] = useState([]);
    const navigate = useNavigate();

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
                const response = await axios.get(`http://localhost:3001/api/diets/nutricionist/${nutricionistId}`, {
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
                await axios.delete(`http://localhost:3001/api/diets/${dietId}`, {
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
                            <button onClick={() => handleDeleteDiet(diet.id)} className="btn-listfood">Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListDietsForNutricionist;
