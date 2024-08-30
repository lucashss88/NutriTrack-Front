import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Backbutton from './components/backbutton';
import { MealsContext } from './mealsContext';

const DietForm = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const { meals, setMeals } = useContext(MealsContext);
  const navigate = useNavigate();

  const loadToken = () => {
    return localStorage.getItem('token');
  };

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

  const removeMeal = (index) => {
    const updatedMeals = meals.filter((meal, mealIndex) => mealIndex !== index);
    setMeals(updatedMeals);
  };

  const goToAddMeal = () => {
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
        foodGroups: meal.foodGroups.map(group => ({
          foodIds: group.food ? [group.food] : [],
          quantities: group.food ? [group.quantity] : []
        }))
      }))
    };

    try {
      const token = loadToken();
      const response = await axios.post('http://localhost:3001/api/diets', dietData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Dieta criada com sucesso!');
      setMeals([]);
      navigate('/home');
    } catch (error) {
      console.error('Error creating diet:', error);
      toast.error('Erro na criação da dieta. Tente novamente!');
    }
  };

  return (
      <div>
        <Backbutton/>
        <div className="App">
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
                    <div key={index} className='block-form label-diets'>
                      <h4>Refeição: {meal.mealType}</h4>
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
