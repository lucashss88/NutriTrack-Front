import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import BackButton from './components/backbutton';

const EditDietPatient = () => {
  const { id: patientId } = useParams(); // Obtém o ID do paciente a partir dos parâmetros da URL
  const [diet, setDiet] = useState(null);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL

  const loadToken = () => {
    return localStorage.getItem('token');
  };

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

  const handleFoodGroupChange = async (foodGroup) => {
    try {
      const token = loadToken();
      const response = await axios.get(`${API_URL}/api/foods?group=${foodGroup}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods by group:', error);
      setError('Error fetching foods by group');
    }
  };

  const handleFoodChange = async (mealFoodId, newFoodId, foodGroup) => {
    try {
      const token = loadToken();
      await axios.put(`${API_URL}/api/diets/update-food`, {
        mealFoodId,
        newFoodId
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      // Atualiza a dieta após a mudança bem-sucedida
      const response = await axios.get(`${API_URL}/api/diets/${patientId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setDiet(response.data);

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
          <div className="subblock">
            <div className="title">
              <h1>Sua Dieta</h1>
            </div>
            <div className="editdiet">
              <div className='block-form label-editdiet'>
                <label>Refeições:</label>
                {diet.Meals && diet.Meals.length > 0 ? (
                    diet.Meals.map(meal => (
                        <span key={meal.id}>
                          <h3>{meal.type}</h3>
                          {meal.Food && meal.Food.length > 0 ? meal.Food.map(mealFood => (
                              <div key={mealFood.id}>
                                <span>{mealFood.name} - {mealFood.MealFood.quantity}g</span>
                                <select
                                    value={mealFood.Food ? mealFood.Food.id : ''}
                                    onFocus={() => {
                                      handleFoodGroupChange(mealFood.Food ? mealFood.Food.foodGroup : '');
                                    }}
                                    onChange={(e) => {
                                      handleFoodChange(mealFood.id, e.target.value, mealFood.Food ? mealFood.Food.foodGroup : '');
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
                        </span>
                    ))
                ) : 'Nenhuma refeição encontrada'}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EditDietPatient;
