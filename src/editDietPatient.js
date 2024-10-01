import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import BackButton from './components/backbutton';

const EditDietPatient = () => {
  const { id: patientId } = useParams();
  const [diet, setDiet] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selectedFoodGroup, setSelectedFoodGroup] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  const loadToken = () => {
    return localStorage.getItem('token');
  };

  // Carrega a dieta do paciente
  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const token = loadToken();
        const response = await axios.get(`${API_URL}/api/diets/${patientId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        setDiet(response.data);
      } catch (error) {
        console.error('Error fetching diet:', error);
        setError('Error fetching diet');
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, [patientId]);

  // Carrega os alimentos por grupo de alimento
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
      setError('Error fetching foods by group');
    }
  };

  // Atualiza o alimento da refeição
  const handleFoodChange = async (mealFoodId, newFoodId, foodGroup) => {
    try {
      const token = loadToken();
      console.log(API_URL);
      const updateResponse = await axios.put(`${API_URL}/api/diets/update-food`, {
        mealFoodId,
        newFoodId,
        foodGroup
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      console.log('Alimento atualizado:', updateResponse.data);

      // Recarrega a dieta após atualização
      const dietResponse = await axios.get(`${API_URL}/api/diets/${patientId}`, {
        headers: {
          'x-auth-token': token
        }
      });

      setDiet(dietResponse.data);

      // Atualiza os alimentos do grupo
      await handleFoodGroupChange(foodGroup);

      toast.success('Alimento atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating food in diet:', error);
      setError('Error updating food in diet');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (!diet) return <p>Nenhuma dieta encontrada.</p>;

  return (
      <div>
        <BackButton />
        <div className="editdiet-container">
          <h1>Editar Dieta</h1>
          <form>
            {diet.Meals && diet.Meals.length > 0 ? (
                diet.Meals.map(meal => (
                    <div key={meal.id} className="meal-section">
                      <h3>{meal.type}</h3>
                      {meal.Food && meal.Food.length > 0 ? meal.Food.map(mealFood => (
                          <div key={mealFood.id} className="meal-food-item">
                            <label>
                              {mealFood.name} - {mealFood.MealFood.quantity}g
                            </label>
                            <select
                                value={mealFood.Food ? mealFood.Food.id : ''}
                                onFocus={() => {
                                  handleFoodGroupChange(mealFood.Food ? mealFood.Food.foodGroup : '');
                                  setSelectedFoodGroup(mealFood.Food ? mealFood.Food.foodGroup : '');
                                }}
                                onChange={(e) => {
                                  handleFoodChange(mealFood.id, e.target.value, selectedFoodGroup);
                                }}
                            >
                              <option value="">Selecione um alimento</option>
                              {foods.length > 0 && foods.map(food => (
                                  <option key={food.id} value={food.id}>
                                    {food.name}
                                  </option>
                              ))}
                            </select>
                          </div>
                      )) : 'Nenhuma comida encontrada'}
                    </div>
                ))
            ) : (
                <p>Nenhuma refeição encontrada.</p>
            )}
          </form>
        </div>
      </div>
  );
};

export default EditDietPatient;

