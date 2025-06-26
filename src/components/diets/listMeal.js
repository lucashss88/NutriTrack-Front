// import React from "react";
//
// const ListMeal = (id, diet) => {
//     if (!diet) return <div>Loading...</div>;
//
//     return (
//         <>
//             {diet.Meals && diet.Meals.length > 0 ? (
//                 diet.Meals.map(meal => (
//                     <div key={meal.id}>
//                         <strong>{meal.type}</strong>: {meal.Food && meal.Food.length > 0 ? meal.Food.map(food => (
//                         <div key={food.id}>
//                             {food.name} ({food.MealFood.quantity}g)
//                         </div>
//                     )) : 'Nenhuma comida encontrada'}
//                     </div>
//                 ))
//             ) : 'Nenhuma refeição encontrada'}
//         </>
//     );
// };
//
// export default ListMeal;