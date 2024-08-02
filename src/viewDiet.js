import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from './components/backbutton';

const ViewDiet = () => {
    const { id } = useParams();
    const [diet, setDiet] = useState(null);

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/api/diets/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDiet(response.data);
            } catch (error) {
                console.error('Error fetching diet: ', error);
            }
        };

        fetchDiet();
    }, [id]);

    if (!diet) return <div>Loading...</div>;

    return (
        <div>
            <h1>Detalhes da Dieta</h1>
            <p><strong>Paciente:</strong> {diet.patient?.username}</p>
            <p><strong>Data de Início:</strong> {new Date(diet.startDate).toLocaleDateString()}</p>
            <p><strong>Data Final:</strong> {new Date(diet.endDate).toLocaleDateString()}</p>
            <h2>Refeições</h2>
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
        </div>
    );
};

export default ViewDiet;


