import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './authContext';
import Navbar from './navbar';
import MainPage from './mainPage';
import DietForm from './dietForm';
import Login from './login';
import Register from './register';
import ListFoods from './listfoods';
import FoodForm from './foodForm';
import Logoutbutton from './logoutbutton';
import ProtectedRoute from './protectedRoute';
import Home from './home';
import EditDietPatient from './editDietPatient';
import ListDietsForNutricionist from './components/diets/listDietsForNutricionist';
import ListDietsForPatient from './components/diets/listDietsForPatient';
import ViewDiet from './viewDiet';
import EditDietNutricionist from './editDietNutricionist';
import ListPatients from './listPatients';
import AddMealForm from './components/diets/addMealForm';
import './assets/styles/diets.css';
import './assets/styles/index.css';
import './assets/styles/login.css';
import './assets/styles/register.css';
import './assets/styles/listfoods.css';
import './assets/styles/navbar.css';
import './assets/styles/home.css';
import './assets/styles/formFood.css';
import './assets/styles/viewDiet.css';
import './assets/styles/editDiet.css';

const App = () => {
    const { user } = useAuth();
    const [showLogoutButton, setShowLogoutButton] = useState(false);

    useEffect(() => {
        setShowLogoutButton(!!user);
    }, [user]);

    return (
        <Router>
            <div>
                {showLogoutButton && (
                    <div className="div-lgtbtn">
                        <Logoutbutton />
                    </div>
                )}
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/diet-form" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <DietForm />
                        </ProtectedRoute>}
                    />
                    <Route path="/add-meal" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <AddMealForm />
                        </ProtectedRoute>}
                    />
                    <Route path="/food-form/:id" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <FoodForm />
                        </ProtectedRoute>}
                    />

                    <Route path="/food-form" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <FoodForm />
                        </ProtectedRoute>}
                    />

                    <Route path="/listpatients" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <ListPatients />
                        </ProtectedRoute>}
                    />

                    <Route path="/nutricionist/diets" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <ListDietsForNutricionist />
                        </ProtectedRoute>}
                    />

                    <Route path="/view-diet/:id" element={
                        <ProtectedRoute allowedRoles={['nutricionist', 'patient']}>
                            <ViewDiet />
                        </ProtectedRoute>}

                    />
                    <Route path="/edit-diet-nutricionist/:id" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <EditDietNutricionist />
                        </ProtectedRoute>}
                    />

                    <Route path="/edit-diet-patient/:id" element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <EditDietPatient />
                        </ProtectedRoute>}
                    />

                    <Route path="/patient/diets" element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <ListDietsForPatient />
                        </ProtectedRoute>}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/listfoods" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <ListFoods />
                        </ProtectedRoute>}
                    />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>

    );
};

export default App;
