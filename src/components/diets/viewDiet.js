import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import BackButton from '../backbutton';

const ViewDiet = () => {
    const {id} = useParams();
    const [diet, setDiet] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/diets/${id}`, {
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

    if (!diet) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="alert alert-warning text-center" role="alert">
                    <h4 className="alert-heading">Dieta não encontrada!</h4>
                    <p>Os detalhes da dieta não puderam ser carregados.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <BackButton/>
            <div
                className="d-flex flex-column justify-content-center align-items-center py-2 py-md-3 px-2 px-md-3">
                <div className="edit-diet-container shadow-lg mt-1 mt-md-5">
                    <div>
                        <h1 className="fs-2 px-2 py-2">Detalhes da Dieta</h1>
                        <div className="info-section-card shadow-sm p-2">
                            <h5 className="mb-3">Informações Gerais</h5>
                            <div className="info-item">
                                <p><strong>Paciente:</strong> {diet.patient?.username || 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <p><strong>Data de
                                    Início:</strong> {new Date(diet.startDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="info-item">
                                <p><strong>Data Final:</strong> {new Date(diet.endDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                        <h3 className="fs-4 text-center mb-3">Refeições Planejadas</h3>
                        {diet.Meals && diet.Meals.length > 0 ? (
                            diet.Meals.map(meal => (
                                <div>
                                    <div key={meal.id} className="meal-display-card shadow-sm p-2">
                                        <h4 className="meal-display-card-title">{meal.type}</h4>

                                        {meal.observation && (
                                            <p className="observation-text mb-3"><strong>Observação:</strong> {meal.observation}</p>
                                        )}

                                        <h5 className="mb-2">Alimentos:</h5>
                                        {meal.Food && meal.Food.length > 0 ? meal.Food.map(food => (
                                            <div key={food.id} className="food-display-item">
                                                <span>{food.name}</span>
                                                <span className="fw-bold">{food.MealFood?.quantity || 0}</span>
                                            </div>
                                        )) : <p className="text-muted">Nenhum alimento especificado para esta refeição.</p>}
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-muted text-center">Nenhuma refeição configurada para esta dieta.</p>}
                    </div>
                </div>
            </div>
        </>

    );
};

export default ViewDiet;


