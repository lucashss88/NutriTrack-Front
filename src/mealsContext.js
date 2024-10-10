import React, { createContext, useState } from 'react';

export const MealsContext = createContext();

export const MealsProvider = ({ children }) => {
    const [meals, setMeals] = useState([]);
    const handleAddMeal = (meal) => {
        setMeals(prevMeals => [...prevMeals, meal]);
    };


    return (
        <MealsContext.Provider value={{ meals, handleAddMeal, setMeals }}>
            {children}
        </MealsContext.Provider>
    );
};
