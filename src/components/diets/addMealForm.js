import React, {useState, useEffect, useContext} from 'react';
import api from '../../services/api';
import {useNavigate} from 'react-router-dom';
import {MealsContext} from '../../context/mealsContext';
import {toast} from 'react-toastify';
import Backbutton from "../backbutton";

const AddMealForm = () => {
    const [foodGroups, setFoodGroups] = useState([]);
    const [meal, setMeal] = useState({
        mealType: 'Café da manhã', foodGroups: [{foodGroup: '', foods: [], food: '', quantity: ''}],
        // substitutes: [],
        observation: '',
    });
    const navigate = useNavigate();
    const {handleAddMeal} = useContext(MealsContext);

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
                console.log('Grupos de alimentos carregados: ', response.data);
            } catch (error) {
                console.error('Error loading food groups:', error);
            }
        };

        fetchFoodGroups();
    }, []);

    const handleFoodGroupChange = async (groupIndex, event) => {
        const group = event.target.value;
        const newMeal = {...meal};
        newMeal.foodGroups[groupIndex].foodGroup = group;

        try {
            const token = loadToken();
            const response = await api.get(`/api/foods?group=${group}`, {
                headers: {
                    'x-auth-token': token
                }
            });
            newMeal.foodGroups[groupIndex].foods = response.data.foods;
            newMeal.foodGroups[groupIndex].food = '';
            newMeal.foodGroups[groupIndex].quantity = '';
            setMeal(newMeal);
            console.log('Alimentos carregados: ', response.data.foods);
        } catch (error) {
            console.error('Error loading foods:', error);
        }
    };

    const handleFoodChange = (groupIndex, field, value) => {
        const newMeal = {...meal};

        if (field === 'food') {
            const selectedFood = newMeal.foodGroups[groupIndex].foods.find(food => String(food.id) === String(value));
            newMeal.foodGroups[groupIndex].food = selectedFood || value;
            console.log('Alimento selecionado: ', selectedFood);
        } else if (field === 'quantity') {
            newMeal.foodGroups[groupIndex].quantity = value;
        }
        setMeal(newMeal);
    };

    // const addSubstitute = () => {
    //     const newMeal = {...meal};
    //     newMeal.substitutes.push({
    //         mealType: '',
    //         foodGroups: [{foodGroup: '', foods: [], food: '', quantity: ''}],
    //         observation: ''
    //     });
    //     setMeal(newMeal);
    // };
    //
    // const handleSubstituteChange = (substituteIndex, groupIndex, field, value) => {
    //     const newMeal = {...meal};
    //
    //     if (field === 'mealType') {
    //         newMeal.substitutes[substituteIndex].mealType = value;
    //     } else if (field === 'foodGroup') {
    //         newMeal.substitutes[substituteIndex].foodGroups[groupIndex].foodGroup = value;
    //         api.get(`/api/foods?group=${value}`)
    //             .then(response => {
    //                 newMeal.substitutes[substituteIndex].foodGroups[groupIndex].foods = response.data.foods;
    //                 setMeal(newMeal);
    //             })
    //             .catch(error => console.error('Erro ao carregar alimentos:', error));
    //     } else if (field === 'food') {
    //         const selectedFood = newMeal.substitutes[substituteIndex].foodGroups[groupIndex].foods.find(
    //             food => String(food.id) === String(value)
    //         );
    //         newMeal.substitutes[substituteIndex].foodGroups[groupIndex].food = selectedFood || value;
    //     } else if (field === 'quantity') {
    //         newMeal.substitutes[substituteIndex].foodGroups[groupIndex].quantity = value;
    //     }
    //
    //     setMeal(newMeal);
    // };
    //
    // const addFoodGroupToSubstitute = (substituteIndex) => {
    //     const newMeal = {...meal};
    //     newMeal.substitutes[substituteIndex].foodGroups.push({
    //         foodGroup: '',
    //         foods: [],
    //         food: '',
    //         quantity: ''
    //     });
    //     setMeal(newMeal);
    // };

    const addFoodGroup = () => {
        const newMeal = {...meal};
        newMeal.foodGroups.push({foodGroup: '', foods: [], food: '', quantity: '', substitutes: [], observation: ''});
        setMeal(newMeal);
        console.log("Refeição adicionada: ", newMeal);
    };

    const removeFoodGroup = (groupIndex) => {
        const newMeal = {...meal};
        newMeal.foodGroups.splice(groupIndex, 1);
        setMeal(newMeal);
        console.log("Refeição removida: ", newMeal);
    };

    const validateForm = () => {
        let isValid = true;
        meal.foodGroups.forEach((group, index) => {
            if (!group.quantity) {
                if (group.foodGroup) {
                    toast.error(`Quantidade é obrigatória para o grupo de alimentos ${index + 1} (${group.foodGroup})`);
                    isValid = false;
                }
            }
            if (group.foodGroup && (!group.quantity) && group.quantity !== '') {
                toast.error(`Quantidade válida é obrigatória para o grupo de alimentos "${group.foodGroup}"`);
                isValid = false;
            }
            // Verificar se o alimento foi selecionado, se o grupo foi
            if (group.foodGroup && !group.food) {
                toast.error(`Alimento é obrigatório para o grupo "${group.foodGroup}"`);
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
        <>
            <Backbutton/>
            <div className="d-flex flex-column justify-content-center align-items-center py-1 py-md-3 px-2 px-md-3">
                <div className="edit-diet-container shadow-lg p-md-3 pt-md-4 p-1 mt-1 mt-md-5">
                    <div>
                        <h1 className="fs-2">Adicionar Refeição</h1>
                        <div className="fs-4 px-4 pb-4">
                            <form>
                                <div className='fs-5'>
                                    <label>Tipo de Refeição</label>
                                    <div className="input-group">
                                        <select
                                            className="input-group-text form-control text-start"
                                            value={meal.mealType}
                                            onChange={(e) => setMeal({...meal, mealType: e.target.value})}
                                        >
                                            <option value="Café da manhã">Café da manhã</option>
                                            <option value="Almoço">Almoço</option>
                                            <option value="Lanche da tarde">Lanche da tarde</option>
                                            <option value="Jantar">Jantar</option>
                                            <option value="Ceia">Ceia</option>
                                        </select>
                                    </div>
                                </div>

                                {meal.foodGroups.map((foodGroup, groupIndex) => (
                                    <div key={groupIndex} className='fs-5'>
                                        <div className="my-4  flex-grow-1 border-top border-success"></div>
                                        <label>Grupo de Alimentos</label>
                                        <div className="input-group">
                                            <select
                                                className="input-group-text form-control text-start"
                                                value={foodGroup.foodGroup}
                                                onChange={(e) => handleFoodGroupChange(groupIndex, e)}
                                            >
                                                <option value="">Escolha o Grupo de Alimento</option>
                                                {foodGroups.map(group => (
                                                    <option key={group} value={group}>{group}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {foodGroup.foodGroup && (
                                            <div className='fs-5'>
                                                <label>Alimento</label>
                                                <div className="input-group">
                                                    <select
                                                        className="input-group-text form-control text-start"
                                                        value={foodGroup.food.id || ''}
                                                        onChange={(e) => handleFoodChange(groupIndex, 'food', e.target.value)}
                                                    >
                                                        <option value="">Escolha o Alimento</option>
                                                        {foodGroup.foods.map(food => (
                                                            <option key={food.id} value={food.id}>{food.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <label>Quantidade (gramas ou medidas)</label>
                                                <div className="input-group">
                                                    <input
                                                        className="input-group-text form-control text-start"
                                                        type="text"
                                                        value={foodGroup.quantity}
                                                        onChange={(e) => handleFoodChange(groupIndex, 'quantity', e.target.value)}
                                                    />
                                                </div>
                                                <button type="button" className="mt-4 btn btn-danger rounded-2 mb-2"
                                                        onClick={() => removeFoodGroup(groupIndex)}>Remover Alimento
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button className="mt-4 btn btn-outline-success rounded-2 mb-2" type="button"
                                        onClick={addFoodGroup}>Adicionar outro Alimento
                                </button>
                                <br></br>
                                <label>Observação</label>
                                <div className="input-group">
                            <textarea className="input-group-text form-control text-start" value={meal.observation}
                                      onChange={(e) => setMeal({...meal, observation: e.target.value})}></textarea>
                                    <br></br>
                                </div>
                                {/*<button type="button" className="mt-4 btn btn-outline-success rounded-2 mb-2"*/}
                                {/*        onClick={addSubstitute}>Adicionar Refeição*/}
                                {/*    Substituta*/}
                                {/*</button>*/}
                                {/*<br></br>*/}
                                {/*{meal.substitutes.map((substitute, substituteIndex) => (*/}
                                {/*    <>*/}
                                {/*        <div className="my-4  flex-grow-1 border-top border-success"></div>*/}
                                {/*        <div className="fs-5" key={substituteIndex}>*/}
                                {/*            <h3>Refeição Substituta {substituteIndex + 1}</h3>*/}
                                {/*            <label>Tipo de Refeição Substituta</label>*/}
                                {/*            <div className="input-group">*/}
                                {/*                <select*/}
                                {/*                    className="input-group-text form-control text-start"*/}
                                {/*                    value={substitute.mealType}*/}
                                {/*                    onChange={(e) => handleSubstituteChange(substituteIndex, 0, 'mealType', e.target.value)}*/}
                                {/*                >*/}
                                {/*                    <option value="Café da manhã">Café da manhã</option>*/}
                                {/*                    <option value="Almoço">Almoço</option>*/}
                                {/*                    <option value="Lanche da tarde">Lanche da tarde</option>*/}
                                {/*                    <option value="Jantar">Jantar</option>*/}
                                {/*                    <option value="Ceia">Ceia</option>*/}
                                {/*                </select>*/}
                                {/*            </div>*/}

                                {/*            /!* Adicionar grupos de alimentos, alimentos e quantidades para a refeição substituta *!/*/}
                                {/*            {substitute.foodGroups.map((group, groupIndex) => (*/}
                                {/*                <div className="fs-5" key={groupIndex}>*/}
                                {/*                    <label>Grupo de Alimentos</label>*/}
                                {/*                    <div className="input-group">*/}
                                {/*                        <select*/}
                                {/*                            className="input-group-text form-control text-start"*/}
                                {/*                            value={group.foodGroup}*/}
                                {/*                            onChange={(e) => handleSubstituteChange(substituteIndex, groupIndex, 'foodGroup', e.target.value)}*/}
                                {/*                        >*/}
                                {/*                            <option value="">Escolha o Grupo de Alimento</option>*/}
                                {/*                            {foodGroups.map((foodGroup) => (*/}
                                {/*                                <option key={foodGroup}*/}
                                {/*                                        value={foodGroup}>{foodGroup}</option>*/}
                                {/*                            ))}*/}
                                {/*                        </select>*/}
                                {/*                    </div>*/}

                                {/*                    {group.foodGroup && (*/}
                                {/*                        <div className="fs-5">*/}
                                {/*                            <label>Alimento</label>*/}
                                {/*                            <div className="input-group">*/}
                                {/*                                <select*/}
                                {/*                                    className="input-group-text form-control text-start"*/}
                                {/*                                    value={group.food?.id || ''}*/}
                                {/*                                    onChange={(e) => handleSubstituteChange(substituteIndex, groupIndex, 'food', e.target.value)}*/}
                                {/*                                >*/}
                                {/*                                    <option value="">Escolha o Alimento</option>*/}
                                {/*                                    {group.foods.map((food) => (*/}
                                {/*                                        <option key={food.id}*/}
                                {/*                                                value={food.id}>{food.name}</option>*/}
                                {/*                                    ))}*/}
                                {/*                                </select>*/}
                                {/*                            </div>*/}

                                {/*                            <label>Quantidade (gramas ou medidas)</label>*/}
                                {/*                            <div className="input-group">*/}
                                {/*                                <input*/}
                                {/*                                    className="input-group-text form-control text-start"*/}
                                {/*                                    type="text"*/}
                                {/*                                    value={group.quantity}*/}
                                {/*                                    onChange={(e) => handleSubstituteChange(substituteIndex, groupIndex, 'quantity', e.target.value)}*/}
                                {/*                                />*/}
                                {/*                            </div>*/}
                                {/*                        </div>*/}
                                {/*                    )}*/}
                                {/*                </div>*/}
                                {/*            ))}*/}

                                {/*            /!* Botão para adicionar mais grupos de alimentos à refeição substituta *!/*/}
                                {/*            <button*/}
                                {/*                type="button"*/}
                                {/*                className="mt-4 btn btn-outline-success rounded-2 mb-2"*/}
                                {/*                onClick={() => addFoodGroupToSubstitute(substituteIndex)}*/}
                                {/*            >*/}
                                {/*                Adicionar outro Alimento Substituto*/}
                                {/*            </button>*/}
                                {/*        </div>*/}
                                {/*    </>*/}
                                {/*))}*/}
                                <button type="button" className="mt-4 btn btn-lg w-100 btn-light rounded-2 mb-2"
                                        onClick={addMeal}>Adicionar Refeição
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMealForm;
