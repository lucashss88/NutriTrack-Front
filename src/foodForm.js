import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from './components/backbutton';

const FoodForm = () => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [foodGroup, setFoodGroup] = useState('');
    const [foodGroups, setFoodGroups] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const API_URL = process.env.REACT_APP_API_URL

    const loadToken = () => {
      return localStorage.getItem('token');
    };

    const voltar = () => {
        navigate('/listfoods');
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
          console.error('Error fetching food groups:', error);
          setError('Error fetching food groups');
        }
      };

      fetchFoodGroups();
      }, []);

    useEffect(() => {
      if (id) {
        const fetchFood = async () => {
          try {
            const token = loadToken();
            const response = await axios.get(`${API_URL}/api/foods/${id}`, {
              headers: {
                'x-auth-token': token
              }
            });
            const food = response.data;
            setName(food.name);
            setCalories(food.calories);
            setProtein(food.protein);
            setCarbs(food.carbs);
            setFat(food.fat);
            setFoodGroup(food.foodGroup);
          } catch (error) {
            console.error('Error fetching food:', error);
            setError('Error fetching food');
          }
        };
        fetchFood();
      }
    }, [id]);

    const handleSubmit = async (event) => {
      event.preventDefault();
      const token = loadToken();
      const foodData = { name, calories, protein, carbs, fat, foodGroup };

      try {
        if (id) {
          await axios.put(`${API_URL}/api/foods/${id}`, foodData, {
            headers: {
              'x-auth-token': token
            }
          });
          toast.success('Alimento editado com sucesso!');
        } else {
          await axios.post(`${API_URL}/api/foods`, foodData, {
            headers: {
              'x-auth-token': token
            }
          });
          toast.success('Alimento criado com sucesso!');
        }

        navigate('/listfoods');
      } catch (error) {
        console.error('Error saving food:', error);
        setError('Error saving food');
        toast.error('Erro na criação do alimento. Tente novamente!');
      }
    };

    if (error) return <p>{error}</p>;

    return (
      <div>
        <BackButton />
        <div className="foodform-container">
            <div className="subblock">
                <div className="title">
                    <h1>{id ? 'Editar Alimento' : 'Criar Alimento'}</h1>
                </div>
                <div className="foodform">
                    <form onSubmit={handleSubmit}>
                        <div className='block-form label-register'>
                            <label>Nome</label>
                            <input
                                placeholder="Nome"
                                className='input-register'
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Calorias</label>
                            <input
                                placeholder="Calorias"
                                className='input-register'
                                type="number"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Proteínas</label>
                            <input
                                placeholder="Proteínas"
                                className='input-register'
                                type="number"
                                step="0.01"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Carboidratos</label>
                            <input
                                placeholder="Carboidratos"
                                className='input-register'
                                type="number"
                                step="0.01"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Gorduras</label>
                            <input
                                placeholder="Gorduras"
                                className='input-register'
                                type="number"
                                step="0.01"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                                required
                            />
                        </div>
                        <div className='block-form label-register'>
                            <label>Grupo de Alimento</label>
                            <select
                                className='input-register'
                                value={foodGroup}
                                onChange={(e) => setFoodGroup(e.target.value)}
                                required
                            >
                                <option value="">Escolha o Grupo de Alimento</option>
                                {foodGroups.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className='foodform-button' type="submit">{id ? 'Editar' : 'Criar'}</button>
                    </form>
                </div>
            </div>
        </div>
      </div>
);
};

export default FoodForm;
