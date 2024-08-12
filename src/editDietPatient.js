import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import BackButton from './components/backbutton';

const EditDietPatient = () => {
  const { id: patientId } = useParams(); // Obtém o ID do paciente a partir dos parâmetros da URL
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const token = loadToken();
        const response = await axios.get(`http://localhost:3001/api/diets/${patientId}`, {
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

  const handleFoodChange = async (mealFoodId, newFoodId) => {
    try {
      const token = loadToken();
      await axios.put(`http://localhost:3001/api/diets/update-food`, {
        mealFoodId,
        newFoodId
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      // Atualiza a dieta após a mudança bem-sucedida
      const response = await axios.get(`http://localhost:3001/api/diets/${patientId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setDiet(response.data);
      toast.success('Alimento atualizado com sucesso!'); // Feedback ao usuário
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
                                    className='input-editdiet'
                                    value={mealFood.id}
                                    onChange={(e) => handleFoodChange(mealFood.MealFood.id, e.target.value)}
                                >
                                  {diet.Meals.flatMap(m => m.Food)
                                      .filter(food => food.foodGroup === mealFood.foodGroup)
                                      .map(food => (
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
