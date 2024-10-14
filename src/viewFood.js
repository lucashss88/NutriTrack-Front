import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Backbutton from './components/backbutton';

const ViewFood = () => {
    const { id } = useParams(); // ID do alimento
    const [food, setFood] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/foods/${id}`);
                setFood(response.data);
            } catch (error) {
                console.error('Error fetching food:', error);
            }
        };

        fetchFood();
    }, [id]);

    if (!food) return <div>Loading...</div>;

    return (
        <div>
            <Backbutton />
            <div className="viewdiet-container">
                <div className="subblock">
                    <div className="title">
                        <h1>Detalhes do Alimento</h1>
                    </div>
                    <div className="viewdiet">
                        <p><strong>Nome:</strong> {food.name}</p>
                        <p><strong>Calorias:</strong> {food.calories} kcal</p>
                        <p><strong>Proteínas:</strong> {food.protein} g</p>
                        <p><strong>Carboidratos:</strong> {food.carbs} g</p>
                        <p><strong>Gorduras:</strong> {food.fat} g</p>
                        <p><strong>Grupo de Alimentos:</strong> {food.foodGroup}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFood;
