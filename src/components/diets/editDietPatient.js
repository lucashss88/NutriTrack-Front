import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useParams, useNavigate} from 'react-router-dom';
import BackButton from '../backbutton';

const EditDietPatient = () => {
    const {id: patientId} = useParams(); // Obtém o ID do paciente a partir dos parâmetros da URL
    const [diet, setDiet] = useState(null);
    const [meals, setMeals] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/diets/${patientId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDiet(response.data);
                setMeals(response.data.Meals || []);
            } catch (error) {
                console.error('Error fetching diet:', error);
            }
        };

        const fetchFoodGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/foods/food-groups`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setFoodGroups(response.data);
            } catch (error) {
                console.error('Error fetching food groups:', error);
            }
        };

        fetchDiet();
        fetchFoodGroups();
    }, [patientId]);

    const handleFoodGroupChange = async (mealIndex, foodIndex, group) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/foods?group=${group}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            const updatedMeals = [...meals];
            updatedMeals[mealIndex].Food[foodIndex].availableFoods = response.data.foods; // Armazena os alimentos disponíveis
            setMeals(updatedMeals);
        } catch (error) {
            console.error('Error fetching foods by group:', error);
        }
    };

    const handleFoodChange = (mealIndex, foodIndex, value) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].Food[foodIndex].id = value; // Atualiza o ID do alimento
        setMeals(updatedMeals);
    };

    const handleQuantityChange = (mealIndex, foodIndex, value) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].Food[foodIndex].MealFood.quantity = value; // Atualiza a quantidade
        setMeals(updatedMeals);
    };

    const handleSaveDiet = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const updatedDiet = {
                meals: meals.map(meal => ({
                    type: meal.type,
                    foodIds: meal.Food.map(food => food.id),
                    quantities: meal.Food.map(food => food.MealFood.quantity)
                }))
            };

            await axios.put(`${API_URL}/api/diets/${patientId}`, updatedDiet, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Dieta atualizada com sucesso!');
            navigate('/patient/diets');
            console.log(updatedDiet);
        } catch (error) {
            console.error('Error updating diet: ', error);
            toast.error('Erro ao atualizar a dieta. Tente novamente!');
        }
    };

    if (!diet) return <div>Carregando...</div>;

    return (
        <>
            <BackButton/>
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center py-1 py-md-3">
                <div className="edit-diet-container shadow-lg p-md-3 pt-md-4 p-1 mt-1 mt-md-5">
                    <div>
                        <h1 className="fs-2 ">Editar Dieta</h1>
                        <div className="fs-4 px-4 pb-4">
                            <form onSubmit={handleSaveDiet}>
                                <div className='fs-5'>
                                    <label className="fs-4 mb-4">Refeições da dieta:</label>
                                    {meals.map((meal, mealIndex) => (
                                        <div key={meal.id} className="meal-edit-card shadow-sm">
                                            <h4 className="meal-edit-card-title text-center">{meal.type}</h4>
                                            <br></br>

                                            {meal.Food.map((food, foodIndex) => (
                                                <div key={food.id} className="food-item-edit">
                                                    <p className="mb-2"><strong>Alimento atual:</strong> {food.name}</p>
                                                    <span className="text-small-hint">
                                                        Para trocar este alimento, primeiro selecione um novo grupo.
                                                    </span>
                                                    <select className="input-group-text form-control text-start"
                                                            onChange={(e) => handleFoodGroupChange(mealIndex, foodIndex, e.target.value)}>
                                                        <option value="">Selecione um novo grupo</option>
                                                        {foodGroups.map((group, index) => (
                                                            <option key={index} value={group}>{group}</option>
                                                        ))}
                                                    </select>
                                                    {/*<h4>obs: se não quiser trocar o alimento, não faça nada.</h4>*/}
                                                    {/* Select para escolher alimentos com base no grupo selecionado */}
                                                    {food.availableFoods && (
                                                        <div className="fs-5">
                                                            <label>Novo alimento:</label>
                                                            <div className="input-group">
                                                                <select
                                                                    className="input-group-text form-control text-start"
                                                                    value={food.id}
                                                                    onChange={(e) => handleFoodChange(mealIndex, foodIndex, e.target.value)}
                                                                >
                                                                    <option value="">Selecione um alimento</option>
                                                                    {food.availableFoods.map(availableFood => (
                                                                        <option key={availableFood.id}
                                                                                value={availableFood.id}>
                                                                            {availableFood.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <label>Quantidade:</label>
                                                    <div className="input-group">
                                                        <input
                                                            className="input-group-text form-control"
                                                            type="text"
                                                            value={food.MealFood.quantity || 0}
                                                            onChange={(e) => handleQuantityChange(mealIndex, foodIndex, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <button type="submit"
                                        className='mt-4 btn btn-lg btn-light w-100 rounded-2 mb-2'>Salvar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditDietPatient;
