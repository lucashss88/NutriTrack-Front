import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from './components/backbutton';

const EditDietPatient = () => {
  const { id: patientId } = useParams(); // Obtém o ID do paciente a partir dos parâmetros da URL
  const [diet, setDiet] = useState(null);
  const [meals, setMeals] = useState([]);
  const [foodGroups, setFoodGroups] = useState([]);
  const [foods, setFoods] = useState([]);
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
                  <label>Refeições:</label>
                  {meals.map((meal, mealIndex) => (
                      <div key={meal.id}>
                        <strong>{meal.type}</strong>
                        {meal.Food.map((food, foodIndex) => (
                            <div key={food.id}>
                              <label>Grupo de Alimentos:</label>
                              <select className="ipt-diets" onChange={(e) => handleFoodGroupChange(mealIndex, foodIndex, e.target.value)}>
                                <option value="">Selecione um grupo</option>
                                {foodGroups.map((group, index) => (
                                    <option key={index} value={group}>{group}</option>
                                ))}
                              </select>

                              {food.availableFoods && (
                                  <div>
                                    <label>Alimento:</label>
                                    <select className="ipt-diets" value={food.id} onChange={(e) => handleFoodChange(mealIndex, foodIndex, e.target.value)}>
                                      <option value="">Selecione um alimento</option>
                                      {food.availableFoods.map(availableFood => (
                                          <option key={availableFood.id} value={availableFood.id}>
                                            {availableFood.name}
                                          </option>
                                      ))}
                                    </select>

                                    <label>Quantidade (g):</label>
                                    <input
                                        className="ipt-diets"
                                        type="text"
                                        value={food.MealFood.quantity || 0}
                                        onChange={(e) => handleQuantityChange(mealIndex, foodIndex, e.target.value)}
                                    />
                                  </div>
                              )}
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

export default EditDietPatient;
