import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const DietForm = () => {
  const [foodGroups, setFoodGroups] = useState([]);
  const [meals, setMeals] = useState([{ mealType: 'breakfast', foodGroups: [{ foodGroup: '', foods: [], food: '', quantity: '' }] }]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const navigate = useNavigate();

  const loadToken = () => {
    return localStorage.getItem('token');
  };

  const voltar = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchFoodGroups = async () => {
      try {
        const token = loadToken();
        const response = await axios.get('http://localhost:3001/api/foods/food-groups', {
          headers: {
            'x-auth-token': token
          }
        });
        console.log('Food groups fetched:', response.data);
        setFoodGroups(response.data);
      } catch (error) {
        console.error('Error loading food groups:', error);
      }
    };

    fetchFoodGroups();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = loadToken();
        const response = await axios.get('http://localhost:3001/api/auth/patients', {
          headers: {
            'x-auth-token': token
          }
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleFoodGroupChange = async (mealIndex, groupIndex, event) => {
    const group = event.target.value;
    const newMeals = [...meals];
    newMeals[mealIndex].foodGroups[groupIndex].foodGroup = group;

    try {
      const token = loadToken();
      const response = await axios.get(`http://localhost:3001/api/foods?group=${group}`, {
        headers: {
          'x-auth-token': token
        }
      });
      console.log(`Foods for group ${group}:`, response.data.foods);
      newMeals[mealIndex].foodGroups[groupIndex].foods = response.data.foods; // Acessando o array foods corretamente
      setMeals(newMeals);
      console.log('Updated meals:', newMeals);
    } catch (error) {
      console.error('Error loading foods:', error);
    }
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...meals];
    newMeals[index][field] = value;
    setMeals(newMeals);
  };

  const handleFoodChange = (mealIndex, groupIndex, field, value) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foodGroups[groupIndex][field] = value;
    setMeals(newMeals);
  };

  const addFoodGroup = (mealIndex) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foodGroups.push({ foodGroup: '', foods: [], food: '', quantity: '' });
    setMeals(newMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { mealType: 'breakfast', foodGroups: [{ foodGroup: '', foods: [], food: '', quantity: '' }] }]);
  };

  const removeFoodGroup = (mealIndex, groupIndex) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foodGroups.splice(groupIndex, 1);
    setMeals(newMeals);
  };

  const createDiet = async (event) => {
    event.preventDefault();
    const dietData = {
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      patientId: selectedPatient,
      meals: meals.map(meal => ({
        type: meal.mealType,
        foodGroups: meal.foodGroups.map(group => ({
          foodIds: group.food ? [group.food] : [],
          quantities: group.food ? [group.quantity] : []
        }))
      })).filter(meal => meal.foodGroups.some(group => group.foodIds.length > 0))
    };

    try {
      const token = loadToken();
      const response = await axios.post('http://localhost:3001/api/diets', dietData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Diet created successfully!');
      console.log('Diet created:', response.data);
    } catch (error) {
      console.error('Error creating diet:', error);
      toast.error('Error creating diet. Please, try again!');
    }
  };

  return (
      <div className="div-diets">
        <h3 onClick={voltar} className='voltar'>VOLTAR</h3>
        <div className="App">
          <div className="subblock">
            <div className="title">
              <h1>Criar Dieta</h1>
            </div>
            <form onSubmit={createDiet}>
              <div className='block-form label-diets'>
                <label>Data de início</label>
                <input className="ipt-diets" type="date" name="startDate" required />
              </div>
              <div className='block-form label-diets'>
                <label>Data final</label>
                <input className="ipt-diets" type="date" name="endDate" required />
              </div>
              <div className='block-form label-diets'>
                <label>Paciente</label>
                <select
                    className="ipt-diets"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.username}
                      </option>
                  ))}
                </select>
              </div>
              {meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className='block-form label-diets'>
                    <label>Refeição</label>
                    <select
                        className="ipt-diets"
                        value={meal.mealType}
                        onChange={(e) => handleMealChange(mealIndex, 'mealType', e.target.value)}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="afternoon snack">Afternoon Snack</option>
                      <option value="dinner">Dinner</option>
                      <option value="supper">Supper</option>
                    </select>
                    {meal.foodGroups.map((foodGroup, groupIndex) => (
                        <div key={groupIndex} className='block-form label-diets'>
                          <label>Grupo de alimentos</label>
                          <select
                              className="ipt-diets"
                              value={foodGroup.foodGroup}
                              onChange={(e) => handleFoodGroupChange(mealIndex, groupIndex, e)}
                          >
                            <option value="">Escolha o Grupo de Alimento</option>
                            {foodGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                          </select>
                          {foodGroup.foodGroup && Array.isArray(foodGroup.foods) && (
                              <>
                                <div className='block-form label-diets'>
                                  <label>Alimento</label>
                                  <select
                                      className="ipt-diets"
                                      value={foodGroup.food}
                                      onChange={(e) => handleFoodChange(mealIndex, groupIndex, 'food', e.target.value)}
                                  >
                                    <option value="">Escolha o Alimento</option>
                                    {foodGroup.foods.map(food => (
                                        <option key={food.id} value={food.id}>{food.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className='block-form label-diets'>
                                  <label>Quantidade (gramas ou medidas)</label>
                                  <input
                                      className="ipt-diets"
                                      type="text"
                                      value={foodGroup.quantity}
                                      onChange={(e) => handleFoodChange(mealIndex, groupIndex, 'quantity', e.target.value)}
                                  />
                                </div>
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={() => removeFoodGroup(mealIndex, groupIndex)}
                                >
                                  Remover Alimento
                                </button>
                              </>
                          )}
                        </div>
                    ))}
                    <button className="btn-add" type="button" onClick={() => addFoodGroup(mealIndex)}>Adicionar alimento</button>
                  </div>
              ))}
              <div>
                <button type="button" onClick={addMeal} className="foodform-button">Adicionar Refeição</button>
                <button type="submit" className="foodform-button">Criar Dieta</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default DietForm;
