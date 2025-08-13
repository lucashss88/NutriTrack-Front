import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../backbutton';
import axios from "axios";
import api from '../../services/api';

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
    const {id} = useParams();
    const API_URL = process.env.REACT_APP_API_URL;

    const loadToken = () => {
        return localStorage.getItem('token');
    };

    useEffect(() => {
        const fetchFoodGroups = async () => {
            try {
                const token = loadToken();
                const response = await api.get('/api/foods/food-groups', {
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
    }, [API_URL, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = loadToken();
        const foodData = {name, calories, protein, carbs, fat, foodGroup};

        try {
            if (id) {
                await axios.put(`${API_URL}/api/foods/${id}`, foodData, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                toast.success('Alimento editado com sucesso!');
            } else {
                await api.post('/api/foods', foodData, {
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
        <>
            {id ? <BackButton/> : null}
            <div className="d-flex flex-column justify-content-center align-items-center py-1 py-md-3">
                <div className="dietform-container shadow-lg p-md-3 pt-md-4 p-1 mt-1 mt-md-5">
                    <div>
                        <h1 className="fs-2">{id ? 'Editar Alimento' : 'Criar Alimento'}</h1>
                        <div className="fs-4 px-4 pb-4">
                            <form onSubmit={handleSubmit}>
                                <div className='fs-5'>
                                    <label>Nome</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Nome"
                                            className='input-group-text form-control text-start'
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-5'>
                                    <label>Calorias</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Calorias"
                                            className='input-group-text form-control text-start'
                                            type="number"
                                            value={calories}
                                            onChange={(e) => setCalories(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-5'>
                                    <label>Proteínas</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Proteínas"
                                            className='input-group-text form-control text-start'
                                            type="number"
                                            step="0.01"
                                            value={protein}
                                            onChange={(e) => setProtein(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-5'>
                                    <label>Carboidratos</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Carboidratos"
                                            className='input-group-text form-control text-start'
                                            type="number"
                                            step="0.01"
                                            value={carbs}
                                            onChange={(e) => setCarbs(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-5'>
                                    <label>Gorduras</label>
                                    <div className="input-group">
                                        <input
                                            placeholder="Gorduras"
                                            className='input-group-text form-control text-start'
                                            type="number"
                                            step="0.01"
                                            value={fat}
                                            onChange={(e) => setFat(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='fs-5'>
                                    <label>Grupo de Alimento</label>
                                    <div className="input-group">
                                        <select
                                            className="input-group-text form-control text-start"
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
                                </div>
                                <button className='mt-4 btn btn-lg btn-light rounded-2 w-100 mb-2' type="submit">{id ? 'Editar' : 'Criar'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default FoodForm;
