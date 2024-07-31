import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../backbutton';

const ListDietsForNutricionist = () => {
    const [diets, setDiets] = useState([]);

    const getNutricionistId = () => {
        const token = localStorage.getItem('token');
        // Decodifique o token para obter o ID do nutricionista
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
                                        <strong>{meal.type}</strong>: {meal.Foods && meal.Foods.length > 0 ? meal.Foods.map(food => (
                                        <div key={food.id}>
                                            {food.name} ({food.MealFood.quantity}g)
                                        </div>
                                    )) : 'Nenhuma comida encontrada'}
                                    </div>
                                ))
                            ) : 'Nenhuma refeição encontrada'}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListDietsForNutricionist;
