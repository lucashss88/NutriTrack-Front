import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MealsContext } from '../../mealsContext';
import { toast } from 'react-toastify';

const AddMealForm = () => {
    const [foodGroups, setFoodGroups] = useState([]);
    const [meal, setMeal] = useState({ mealType: 'Café da manhã', foodGroups: [{ foodGroup: '', foods: [], food: '', quantity: '', substitutes: [] }] });
    const navigate = useNavigate();
    const { handleAddMeal } = useContext(MealsContext);
    const API_URL = process.env.REACT_APP_API_URL

    const loadToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const fetchFoodGroups = async () => {
            try {
                const token = loadToken();
                const response = await axios.get(`${API_URL}/api/foods/food-groups`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setFoodGroups(response.data);
            } catch (error) {
                console.error('Error loading food groups:', error);
            }
        };

        fetchFoodGroups();
    }, []);

    const handleFoodGroupChange = async (groupIndex, event) => {
        const group = event.target.value;
        const newMeal = { ...meal };
        newMeal.foodGroups[groupIndex].foodGroup = group;

        try {
            const token = loadToken();
            const response = await axios.get(`${API_URL}/api/foods?group=${group}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            newMeal.foodGroups[groupIndex].foods = response.data.foods;
            setMeal(newMeal);
        } catch (error) {
            console.error('Error loading foods:', error);
        }
    };

    const handleFoodChange = (groupIndex, field, value) => {
        const newMeal = { ...meal };

        if (field === 'food') {
            const selectedFood = newMeal.foodGroups[groupIndex].foods.find(food => String(food.id) === String(value));
            newMeal.foodGroups[groupIndex].food = selectedFood || value;
            console.log('Alimento selecionado: ', selectedFood);
        } else if (field === 'quantity') {
            newMeal.foodGroups[groupIndex].quantity = value;
        }
        setMeal(newMeal);
    };




    const handleSubstituteChange = (groupIndex, field, value) => {
        const newMeal = { ...meal };

        if(field === 'food') {
            const selectedFood = newMeal.foodGroups[groupIndex].foods.find(food => String(food.id) === String(value));
            const substitutes = [...newMeal.foodGroups[groupIndex].substitutes];
            newMeal.foodGroups[groupIndex].substitutes = substitutes;
            setMeal(newMeal);

            console.log('Added Substitute:', selectedFood);
            if (!substitutes.some(sub => sub.id === selectedFood.id)) {
                substitutes.push({
                    id: selectedFood.id,
                    name: selectedFood.name,
                });
            }
        }
    };



    const addFoodGroup = () => {
        const newMeal = { ...meal };
        newMeal.foodGroups.push({ foodGroup: '', foods: [], food: '', quantity: '', substitutes: [] });
        setMeal(newMeal);
    };

    const removeFoodGroup = (groupIndex) => {
        const newMeal = { ...meal };
        newMeal.foodGroups.splice(groupIndex, 1);
        setMeal(newMeal);
    };

    const validateForm = () => {
        let isValid = true;
        meal.foodGroups.forEach((group, index) => {
            if (!group.quantity) {
                toast.error(`Quantidade é obrigatória para o grupo de alimentos ${index + 1}`);
                isValid = false;
            }
        });
        return isValid;
    };

    const addMeal = () => {
        if (validateForm()) {
            handleAddMeal(meal);
            navigate(-1);
        }
    };


    return (
      <div>
        <div className="App">
          <div className="subblock">
            <div className="title">
              <h1>Adicionar Refeição</h1>
            </div>
            <div className="dietform">
              <form>
                <div className='block-form label-diets'>
                  <label>Tipo de Refeição</label>
                  <select
                    className="ipt-diets"
                    value={meal.mealType}
                    onChange={(e) => setMeal({ ...meal, mealType: e.target.value })}
                  >
                    <option value="Café da manhã">Café da manhã</option>
                    <option value="Almoço">Almoço</option>
                    <option value="Lanche da tarde">Lanche da tarde</option>
                    <option value="Jantar">Jantar</option>
                    <option value="Ceia">Ceia</option>
                  </select>
                </div>

                {meal.foodGroups.map((foodGroup, groupIndex) => (
                  <div key={groupIndex} className='block-form label-diets'>
                     <label>Grupo de Alimentos</label>
                     <select
                       className="ipt-diets"
                       value={foodGroup.foodGroup}
                       onChange={(e) => handleFoodGroupChange(groupIndex, e)}
                     >
                       <option value="">Escolha o Grupo de Alimento</option>
                       {foodGroups.map(group => (
                         <option key={group} value={group}>{group}</option>
                       ))}
                     </select>

                     {foodGroup.foodGroup && (
                       <>
                         <label>Alimento</label>
                         <select
                           className="ipt-diets"
                           value={foodGroup.food.id || ''}
                           onChange={(e) => handleFoodChange(groupIndex, 'food', e.target.value)}
                         >
                           <option value="">Escolha o Alimento</option>
                           {foodGroup.foods.map(food => (
                             <option key={food.id} value={food.id}>{food.name}</option>
                           ))}
                         </select>
                         <label>Quantidade (gramas ou medidas)</label>
                         <input
                           className="ipt-diets"
                           type="text"
                           value={foodGroup.quantity}
                           onChange={(e) => handleFoodChange(groupIndex, 'quantity', e.target.value)}
                         />
                         {/*<label>Adicionar Substitutos</label>*/}
                         {/*<select*/}
                         {/*  className="ipt-diets"*/}
                         {/*  onChange={(e) => handleSubstituteChange(groupIndex, 'food', e.target.value)}*/}
                         {/*>*/}
                         {/*  <option value="">Escolha um Alimento Substituto</option>*/}
                         {/*  {foodGroup.foods.map(food => (*/}
                         {/*    <option key={food.id} value={food.id}>{food.name}</option>*/}
                         {/*  ))}*/}
                         {/*</select>*/}
                         {/*{foodGroup.substitutes.length > 0 && (*/}
                         {/*  <div>*/}
                         {/*    <p>Alimentos Substitutos:</p>*/}
                         {/*    <ul>*/}
                         {/*      {foodGroup.substitutes.map(sub => (*/}
                         {/*        <p key={sub.id} className="text-white">*/}
                         {/*          {sub.name} ({sub.quantity}g)*/}
                         {/*        </p>*/}
                         {/*      ))}*/}
                         {/*    </ul>*/}
                         {/*  </div>*/}
                         {/*)}*/}

                         <button type="button" className="btn-remove" onClick={() => removeFoodGroup(groupIndex)}>Remover Alimento</button>
                       </>
                     )}
                  </div>
                ))}
                <button className="btn-add" type="button" onClick={addFoodGroup}>Adicionar outro Alimento</button>
                <button type="button" className="btn-form" onClick={addMeal}>Adicionar Refeição</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AddMealForm;
