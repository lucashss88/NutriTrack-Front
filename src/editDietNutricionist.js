import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from './components/backbutton';

const EditDietNutricionist = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [diet, setDiet] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [foods, setFoods] = useState([]);
    const [selectedFoodGroup, setSelectedFoodGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.REACT_APP_API_URL;

    const loadToken = () => {
        return localStorage.getItem('token');
    };

    // Carrega a dieta e preenche os campos de data
    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const token = loadToken();
                const response = await axios.get(`${API_URL}/api/diets/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDiet(response.data);
                setStartDate(response.data.startDate.split('T')[0]);
                setEndDate(response.data.endDate.split('T')[0]);
            } catch (error) {
                console.error('Error fetching diet:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiet();
    }, [id]);

    // Carrega os alimentos por grupo de alimentos
    const handleFoodGroupChange = async (foodGroup) => {
        try {
            const token = loadToken();
            const response = await axios.get(`${API_URL}/api/foods?group=${foodGroup}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            setFoods(response.data.foods);
        } catch (error) {
            console.error('Error fetching foods by group:', error);
        }
    };

    // Atualiza o alimento da refeição
    const handleFoodChange = (mealIndex, foodIndex, newFoodId) => {
        const updatedDiet = { ...diet };
        updatedDiet.Meals[mealIndex].Food[foodIndex].id = newFoodId;
        setDiet(updatedDiet);
    };

    // Salvar alterações da dieta e refeições
    const handleSave = async () => {
        try {
            const token = loadToken();
            await axios.put(`${API_URL}/api/diets/${id}`, {
                startDate,
                endDate,
                meals: diet.Meals.map((meal) => ({
                    type: meal.type,
                    foodIds: meal.Food.map((food) => food.id)
                }))
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            toast.success('Dieta atualizada com sucesso!');
            navigate('/diets');
        } catch (error) {
            console.error('Error updating diet:', error);
            toast.error('Erro ao atualizar a dieta. Tente novamente.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!diet) return <div>Nenhuma dieta encontrada.</div>;

    return (
        <div>
            <BackButton />
            <div className="editdiet-container">
                <h1>Editar Dieta</h1>
                <form>
                    <div className="block-form label-editdiet">
                        <label>Data de Início:</label>
                        <input className="input-editdiet" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="block-form label-editdiet">
                        <label>Data Final:</label>
                        <input className="input-editdiet" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>

                    <div className="block-form label-editdiet">
                        <label>Refeições:</label>
                        {diet.Meals && diet.Meals.length > 0 ? (
                            diet.Meals.map((meal, mealIndex) => (
                                <div key={meal.id}>
                                    <h3>{meal.type}</h3>
                                    {meal.Food && meal.Food.length > 0 ? meal.Food.map((mealFood, foodIndex) => (
                                        <div key={mealFood.id} className="meal-food-item">
                                            <label>{mealFood.name} ({mealFood.MealFood.quantity}g)</label>
                                            <select
                                                value={mealFood.id}
                                                onChange={(e) => handleFoodChange(mealIndex, foodIndex, e.target.value)}
                                                onFocus={() => handleFoodGroupChange(mealFood.foodGroup)}
                                            >
                                                <option value="">Selecione um alimento</option>
                                                {foods.length > 0 && foods.map(food => (
                                                    <option key={food.id} value={food.id}>
                                                        {food.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )) : 'Nenhum alimento encontrado.'}
                                </div>
                            ))
                        ) : (
                            'Nenhuma refeição encontrada.'
                        )}
                    </div>

                    <button type="button" className="editdiet-button" onClick={handleSave}>Salvar</button>
                </form>
            </div>
        </div>
    );
};

export default EditDietNutricionist;

