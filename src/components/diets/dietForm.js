import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Backbutton from '../backbutton';
import { MealsContext } from '../../context/mealsContext';

const DietForm = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { meals, setMeals } = useContext(MealsContext);
  const navigate = useNavigate();

  const loadToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const storedDietData = JSON.parse(localStorage.getItem('dietFormData'));
    if (storedDietData) {
      setStartDate(storedDietData.startDate || '');
      setEndDate(storedDietData.endDate || '');
      setSelectedPatient(storedDietData.selectedPatient || '');
    }

    const fetchPatients = async () => {
      try {
        const token = loadToken();
        const response = await api.get('/api/auth/patients', {
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

  const removeMeal = (index) => {
    const updatedMeals = meals.filter((meal, mealIndex) => mealIndex !== index);
    setMeals(updatedMeals);
  };

  const goToAddMeal = () => {
    const dietFormData = {
      startDate,
      endDate,
      selectedPatient,
    };
    localStorage.setItem('dietFormData', JSON.stringify(dietFormData));
    navigate('/add-meal');
  };

  const createDiet = async (event) => {
    event.preventDefault();

    const dietData = {
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      patientId: selectedPatient,
      meals: meals.map(meal => ({
        type: meal.mealType,
        observation: meal.observation || '',
        foodGroups: meal.foodGroups.map(group => ({
          foodIds: group.food ? [group.food.id] : [],
          quantities: group.food ? [group.quantity] : [],
        })),
        substitutes: meal.substitutes?.map(substitute => ({
          type: substitute.mealType,
          observation: substitute.observation || '',
          foodGroups: substitute.foodGroups.map(group => ({
            foodIds: group.food ? [group.food.id] : [],
            quantities: group.food ? [group.quantity] : [],
            substitutes: group.substitutes.map(sub => ({
              id: sub.id,
              name: sub.name,
            })),
          }))
        })) || []
      }))
    };

    console.log('Diet Data:', dietData);
    localStorage.setItem('dietData', JSON.stringify(dietData));

    try {
      const token = loadToken();
      const response = await api.post('/api/diets', dietData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Dieta criada com sucesso!');
      setMeals([]); // Limpar as refeições após criação da dieta
      localStorage.removeItem('dietFormData');
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      console.error('Error creating diet:', error);
      toast.error('Erro na criação da dieta. Tente novamente!');
    }
  };


  return (
      <div className="dietform">
        <Backbutton/>
        <div className="dietform-container">
          <div className="subblock">
            <div className="title">
              <h1>Criar Dieta</h1>
            </div>
            <div className="dietform">
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
                    <option value="">Escolha o paciente</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.username}
                        </option>
                    ))}
                  </select>
                </div>

                {meals.map((meal, index) => (
                    <div key={index} className=''>
                      <div className="divMeal">
                        <p><strong>Refeição: {meal.mealType}</strong></p>

                        {/*{meal.foodGroups.map((foodGroup, fgIndex) => {*/}
                        {/*  const selectedFood = foodGroup.food;*/}
                        {/*  return (*/}
                        {/*      <div key={fgIndex}>*/}
                        {/*        <p>{selectedFood?.name ? selectedFood.name : 'Alimento não encontrado'} - {foodGroup.quantity}g</p>*/}
                        {/*        {foodGroup.substitutes.length > 0 && (*/}
                        {/*            <div>*/}
                        {/*              <strong>Substitutos:</strong>*/}
                        {/*              <ul>*/}
                        {/*                {foodGroup.substitutes.map(sub => (*/}
                        {/*                    <p key={sub.id}>{sub.name} ({sub.quantity}g)</p>*/}
                        {/*                ))}*/}
                        {/*              </ul>*/}
                        {/*            </div>*/}
                        {/*        )}*/}
                        {/*      </div>*/}
                        {/*  );*/}
                        {/*})}*/}

                      </div>
                      <button type="button" onClick={() => removeMeal(index)} className="btn-remove">
                        Remover Refeição
                      </button>
                    </div>
                ))}




                <button type="button" onClick={goToAddMeal} className="btn-form">Adicionar Refeição</button>

                <button type="submit" className="btn-form">Criar Dieta</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DietForm;
