import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        const fetchFoods = async () => {
            try {
                const token = loadToken();
                const response = await api.get('/api/foods', {
                    headers: {
                        'x-auth-token': token
                    },
                    params: {
                        group: selectedFoodGroup,
                        page: currentPage,
                        limit: itemsPerPage
                    }
                });

                const fetchedFoods = response.data.foods;

                if (fetchedFoods.length === 0) {
                    setNoFoodsMessage('Nenhum alimento encontrado para este grupo.');
                } else {
                    setNoFoodsMessage('');
                }

                setFoods(fetchedFoods);
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
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this food?')) {
            try {
                const token = loadToken();
                // eslint-disable-next-line no-template-curly-in-string
                await api.delete('/api/foods/${id}', {
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

    const navigateToView = (id) => {
        navigate(`/view-food/${id}`);
    }

    const filteredFoods = selectedFoodGroup
        ? foods.filter(food => food.foodGroup === selectedFoodGroup)
        : foods;

    return (
        <div className="p-3 fs-6 d-flex flex-column">
            <h1 className="fs-2">Lista de Alimentos</h1>
            <div>
                <label>Escolha o Grupo de Alimento: </label>
                <select
                    className="input-group form-control"
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
                            <button onClick={() => navigateToUpdate(food.id)} className="btn-nutritrack mx-1">Editar</button>
                            <button onClick={() => navigateToView(food.id)} className="btn-nutritrack mx-1">Visualizar</button>
                            <button onClick={() => handleDelete(food.id)} className="btn btn-danger mx-1">Deletar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="pagination">
                <button className="navbar-link border-0 me-1" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="navbar-link border-0 ms-1" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Próximo
                </button>
            </div>
        </div>
    );
};

export default ListFoods;
