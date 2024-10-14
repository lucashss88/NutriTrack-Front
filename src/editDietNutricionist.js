import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './components/backbutton';
import { toast } from 'react-toastify';

const EditDietNutricionist = () => {
    const { id } = useParams();
    const [diet, setDiet] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [meals, setMeals] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const [foods, setFoods] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

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
                setStartDate(new Date(response.data.startDate).toISOString().split('T')[0]);
                setEndDate(new Date(response.data.endDate).toISOString().split('T')[0]);
                setMeals(response.data.Meals || []);
            } catch (error) {
                console.error('Error fetching diet: ', error);
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
                console.error('Error fetching food groups: ', error);
            }
        };

        fetchDiet();
        fetchFoodGroups();
    }, [id]);

    const handleFoodGroupChange = async (mealIndex, foodIndex, group) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/foods?group=${group}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            const updatedMeals = [...meals];
            updatedMeals[mealIndex].Food[foodIndex].availableFoods = response.data.foods; // Armazena alimentos disponíveis para aquele alimento específico
            setMeals(updatedMeals);
        } catch (error) {
            console.error('Error fetching foods by group: ', error);
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
                startDate,
                endDate,
                meals: meals.map(meal => ({
                    type: meal.type,
                    foodIds: meal.Food.map(food => food.id),
                    quantities: meal.Food.map(food => food.MealFood.quantity)
                }))
            };

            await axios.put(`${API_URL}/api/diets/${id}`, updatedDiet, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Dieta atualizada com sucesso!');
            navigate('/nutricionist/diets');
            console.log(updatedDiet);
        } catch (error) {
            console.error('Error updating diet: ', error);
            toast.error('Erro ao atualizar a dieta. Tente novamente!');
        }
    };

    if (!diet) return <div>Carregando...</div>;

    return (
        <div>
            <BackButton />
            <div className="editdiet-container">
                <div className="subblock">
                    <div className="title">
                        <h1>Editar Dieta</h1>
                    </div>
                    <div className="editdiet">
                        <form onSubmit={handleSaveDiet}>
                            <div className='block-form label-editdiet'>
                                <label>Data de Início:</label>
                                <input className='input-editdiet ipt-diets' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className='block-form label-editdiet'>
                                <label>Data Final:</label>
                                <input className='input-editdiet ipt-diets' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className='block-form label-editdiet'>
                                <label>Refeições:</label>
                                {meals.map((meal, mealIndex) => (
                                    <div key={meal.id}>
                                        <strong>{meal.type}</strong>
                                        <br></br>

                                        {meal.Food.map((food, foodIndex) => (
                                            <div key={food.id}>
                                                <p>Caso deseje trocar, selecione um grupo de alimento.</p>
                                                <span>Alimento atual: <b>{food.name}</b></span>
                                                <select className="ipt-diets" onChange={(e) => handleFoodGroupChange(mealIndex, foodIndex, e.target.value)}>
                                                    <option value="">Selecione um grupo de alimento</option>
                                                    {foodGroups.map((group, index) => (
                                                        <option key={index} value={group}>{group}</option>
                                                    ))}
                                                </select>
                                                {/*<h4>obs: se não quiser trocar o alimento, não faça nada.</h4>*/}
                                                {/* Select para escolher alimentos com base no grupo selecionado */}
                                                {food.availableFoods && (
                                                    <div>
                                                        <label>Novo alimento:</label>
                                                        <select className="ipt-diets" value={food.id} onChange={(e) => handleFoodChange(mealIndex, foodIndex, e.target.value)}>
                                                            <option value="">Selecione um alimento</option>
                                                            {food.availableFoods.map(availableFood => (
                                                                <option key={availableFood.id} value={availableFood.id}>
                                                                    {availableFood.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <label>Quantidade:</label>
                                                <input
                                                    className="ipt-diets"
                                                    type="text"
                                                    value={food.MealFood.quantity || 0}
                                                    onChange={(e) => handleQuantityChange(mealIndex, foodIndex, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className='editdiet-button'>Salvar</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EditDietNutricionist;