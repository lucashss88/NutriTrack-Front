import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
        // substitutes: meal.substitutes?.map(substitute => ({
        //   type: substitute.mealType,
        //   observation: substitute.observation || '',
        //   foodGroups: substitute.foodGroups.map(group => ({
        //     foodIds: group.food ? [group.food.id] : [],
        //     quantities: group.food ? [group.quantity] : [],
        //     substitutes: group.substitutes.map(sub => ({
        //       id: sub.id,
        //       name: sub.name,
        //     })),
        //   }))
        // })) || []
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
      setMeals([]);
      localStorage.removeItem('dietFormData');
      console.log(response.data);
      navigate('/home');
    } catch (error) {
      console.error('Error creating diet:', error);
      toast.error('Erro na criação da dieta. Tente novamente!');
    }
  };


  return (
      <div className="d-flex flex-column justify-content-center align-items-center py-1 py-md-3 px-2 px-md-3">
        <div className="edit-diet-container shadow-lg p-md-3 pt-md-4 p-1 mt-1 mt-md-5">
          <div>
            <h1 className="fs-2">Criar Dieta</h1>
            <div className="fs-4 px-4 pb-4">
              <form onSubmit={createDiet}>
                <div className='fs-5'>
                  <label>Data de início</label>
                  <div className="input-group">
                    <input className="input-group-text form-control" type="date" name="startDate" required />
                  </div>
                </div>
                <div className='fs-5'>
                  <label>Data final</label>
                  <div className="input-group">
                    <input className="input-group-text form-control" type="date" name="endDate" required />
                  </div>
                </div>
                <div className='fs-5'>
                  <label>Paciente</label>
                  <div className="input-group">
                    <select
                        className="input-group-text form-control text-start"
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
                </div>

                {meals.map((meal, index) => (
                    <div key={index} className='fs-5 meal-card p-0 mt-4 mb-4 shadow-sm'>
                      <div className="meal-card-header">
                        <p><strong>Refeição: {meal.mealType}</strong></p>
                        <button
                            type="button"
                            onClick={() => removeMeal(index)}
                            className="btn btn-danger btn-sm btn-remove-meal"
                        >
                          Remover
                        </button>
                      </div>
                      <div className="meal-card-body">
                        {/*{meal.observation && (*/}
                        {/*    <p className="mb-2"><strong>Observação:</strong> {meal.observation}</p>*/}
                        {/*)}*/}
                        {/*<h6 className="mt-3 mb-2 text-nutritrack-green">Alimentos:</h6>*/}
                        {/*{meal.foodGroups.length > 0 ? (*/}
                        {/*    meal.foodGroups.map((foodGroup, fgIndex) => (*/}
                        {/*        <div key={fgIndex} className="meal-item">*/}
                        {/*          <span>{foodGroup.food?.name || 'Alimento não encontrado'}</span>*/}
                        {/*          <span className="fw-bold">{foodGroup.quantity}g</span>*/}
                        {/*        </div>*/}
                        {/*    ))*/}
                        {/*) : (*/}
                        {/*    <p className="text-muted">Nenhum alimento adicionado.</p>*/}
                        {/*)}*/}
                      </div>
                    </div>
                ))}

                <button type="button" onClick={goToAddMeal} className="mt-4 btn btn-lg btn-light w-100 rounded-2 mb-2">Adicionar Refeição</button>

                <button type="submit" className="mt-4 btn btn-lg btn-light rounded-2 w-100 mb-2">Criar Dieta</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DietForm;
