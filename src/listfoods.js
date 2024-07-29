import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListFoods = () => {
    const [foods, setFoods] = useState([]);
    const [foodGroups, setFoodGroups] = useState([]);
    const [selectedFoodGroup, setSelectedFoodGroup] = useState('');
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;
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
                const response = await axios.get('http://localhost:3001/api/foods', {
                    headers: {
                        'x-auth-token': token
                    },
                    params: {
                        foodGroup: selectedFoodGroup,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                });
                setFoods(response.data.foods);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
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
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food?')) {
            try {
                const token = loadToken();
                await axios.delete(`http://localhost:3001/api/foods/${id}`, {
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
            <h3 onClick={voltar} className='voltar'>VOLTAR</h3>
            <h1>Lista de Alimentos</h1>
            <div>
                <label>Escolha o Grupo de Alimento: </label>
                <select
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
                            <button className="btn-listfood">Visualizar</button>
                            <button onClick={() => handleDelete(food.id)} className="btn-listfood">Deletar</button>
                            <button onClick={() => navigateToUpdate(food.id)} className="btn-listfood">Editar</button>
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
