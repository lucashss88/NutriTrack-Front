import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './components/backbutton';

const EditDietNutricionist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diet, setDiet] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
                setStartDate(response.data.startDate.split('T')[0]);
                setEndDate(response.data.endDate.split('T')[0]);
            } catch (error) {
                console.error('Error fetching diet:', error);
            }
        };

        fetchDiet();
    }, [id]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3001/api/diets/${id}`, {
                startDate,
                endDate,
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            navigate('/diets');
        } catch (error) {
            console.error('Error updating diet:', error);
        }
    };

    if (!diet) return <div>Loading...</div>;

    return (
        <div>
            <BackButton />
            <div className="editdiet-container">
                <div className="subblock">
                    <div className="title">
                        <h1>Editar Dieta</h1>
                    </div>
                    <div className="editdiet">
                        <form>
                            <div className='block-form label-editdiet'>
                                <label>Data de Início:</label>
                                <input className='input-editdiet' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className='block-form label-editdiet'>
                                <label>Data Final:</label>
                                <input className='input-editdiet' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className='block-form label-editdiet'>
                                <label>Refeições:</label>
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
                            <button type="button" className='editdiet-button' onClick={handleSave}>Salvar</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EditDietNutricionist;
