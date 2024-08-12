import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../authContext';
import BackButton from '../backbutton';
import { useNavigate } from 'react-router-dom';

const ListDietsForPatient = () => {
    const [diets, setDiets] = useState([]);
    const { user } = useAuth();
    const patientId = user.id;
    const navigate = useNavigate();

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
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListDietsForPatient;