import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Backbutton from '../backbutton';
import axios from "axios";

const ViewFood = () => {
    const {id} = useParams(); // ID do alimento
    const [food, setFood] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchFood = async () => {
            try {
                // eslint-disable-next-line no-template-curly-in-string
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
        <>
            <Backbutton/>
            <div className=" d-flex flex-column justify-content-center align-items-center py-1 py-md-3">
                <div className="view-container shadow-sm mt-1 mt-md-5 p-md-3 pt-md-4 p-1">
                    <div>
                        <h1 className="fs-2 px-2 py-2">Detalhes do Alimento</h1>
                        <div>
                            <div className="fs-4 px-2 py-2">
                                <div className="food-display-item">
                                    <p><strong>Nome:</strong> {food.name}</p>
                                </div>
                                <div className="food-display-item">
                                    <p><strong>Calorias:</strong> {food.calories} kcal</p>
                                </div>
                                <div className="food-display-item">
                                    <p><strong>Proteínas:</strong> {food.protein} g</p>
                                </div>
                                <div className="food-display-item">
                                    <p><strong>Carboidratos:</strong> {food.carbs} g</p>
                                </div>
                                <div className="food-display-item">
                                    <p><strong>Gorduras:</strong> {food.fat} g</p>
                                </div>
                                <div className="food-display-item">
                                    <p><strong>Grupo de Alimentos:</strong> {food.foodGroup}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ViewFood;
