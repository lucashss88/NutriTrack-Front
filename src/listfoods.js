import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from './components/backbutton';

const ListFoods = () => {
    const [foods, setFoods] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const [selectedFoodGroup, setSelectedFoodGroup] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [noFoodsMessage, setNoFoodsMessage] = useState('');
    const itemsPerPage = 20;
    const navigate = useNavigate();
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
                console.error('Error fetching food groups:', error);
                setError('Error fetching food groups');
            }
        };

        fetchFoodGroups();
    }, []);

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const token = loadToken();
                const response = await axios.get(`${API_URL}/api/foods`, {
                    headers: {
                        'x-auth-token': token
                    },
                    params: {
                        group: selectedFoodGroup,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                });
                setFoods(response.data.foods);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));

                if (fetchedFoods.length === 0) {
                    setNoFoodsMessage('Nenhum alimento encontrado para este grupo.');
                } else {
                    setNoFoodsMessage('');
                }

            } catch (error) {
                console.error('Error fetching foods:', error);
                setError('Error fetching foods');
            }
        };

        fetchFoods();
    }, [selectedFoodGroup, currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };


    if (error) return <p>{error}</p>;

    const handleSelectFoodGroup = (event) => {
        setSelectedFoodGroup(event.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food?')) {
            try {
                const token = loadToken();
                await axios.delete(`${API_URL}/api/foods/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                toast.success(`Food removed!`);
                setFoods(foods.filter(food => food.id !== id));
            } catch (error) {
                console.error('Error deleting food:', error);
                setError('Error deleting food');
                toast.error('Error deleting food. Try again!');
            }
        }
    };

    const navigateToUpdate = (id) => {
        navigate(`/food-form/${id}`);
    };

    const filteredFoods = selectedFoodGroup
        ? foods.filter(food => food.foodGroup === selectedFoodGroup)
        : foods;

    return (
        <div className="list-foods">
            <BackButton />
            <h1>Lista de Alimentos</h1>
            <div>
                <label>Escolha o Grupo de Alimento: </label>
                <select
                    className="input-register"
                    value={selectedFoodGroup}
                    onChange={handleSelectFoodGroup}
                >
                    <option value="">Todos</option>
                    {foodGroups.map((group) => (
                        <option key={group} value={group}>
                            {group}
                        </option>
                    ))}
                </select>
            </div>

            {noFoodsMessage && <p>{noFoodsMessage}</p>}
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Proteínas</th>
                    <th>Calorias</th>
                    <th>Grupo de Alimento</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {filteredFoods.map((food) => (
                    <tr key={food.id}>
                        <td>{food.name}</td>
                        <td>{food.protein}</td>
                        <td>{food.calories}</td>
                        <td>{food.foodGroup}</td>
                        <td>
                            <button onClick={() => navigateToUpdate(food.id)} className="btn-listfood">Editar</button>
                            <button onClick={() => handleDelete(food.id)} className="btn-listfood">Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <button className="btn-listfood" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn-listfood" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListFoods;
