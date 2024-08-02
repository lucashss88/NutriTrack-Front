import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EditDietPatient = ({ patientId }) => {
  const [diet, setDiet] = useState(null);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadToken = () => {
    return localStorage.getItem('token');
  };

  const voltar = () => {
    navigate('/home');
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
      }
    };

    fetchDiet();
  }, [patientId]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = loadToken();
        const response = await axios.get('http://localhost:3001/api/foods', {
          headers: {
            'x-auth-token': token
          }
        });
        setFoods(response.data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setError('Error fetching foods');
      }
    };
    fetchFoods();
  }, []);

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
      // Fetch the updated diet
      const response = await axios.get(`http://localhost:3001/api/diets/${patientId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setDiet(response.data);
    } catch (error) {
      console.error('Error updating food in diet:', error);
      setError('Error updating food in diet');
    }
  };

  if (error) return <p>{error}</p>;
  if (!diet) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sua Dieta</h1>
      <h3 onClick={voltar} className='voltar'>VOLTAR</h3>
      <ul>
        {diet.meals.map(meal => (
          <li key={meal.id}>
          <h3>{meal.type}</h3>
          {meal.foods.map(mealFood => (
            <div key={mealFood.id}>
              <span>{mealFood.food.name} - {mealFood.quantity}</span>
              <select
                value={mealFood.food.id}
                onChange={(e) => handleFoodChange(mealFood.id, e.target.value)}
              >
                {foods
                  .filter(food => food.foodGroup === mealFood.food.foodGroup)
                  .map(food => (
                    <option key={food.id} value={food.id}>
                      {food.name}
                    </option>
                  ))}
              </select>
            </div>
          ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditDietPatient;
