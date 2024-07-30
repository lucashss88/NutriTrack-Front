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
import EditDiet from './editDiet';
import './assets/styles/diets.css';
import './assets/styles/index.css';
import './assets/styles/login.css';
import './assets/styles/register.css';
import './assets/styles/listfoods.css';
import './assets/styles/navbar.css';
import './assets/styles/home.css';
import './assets/styles/formFood.css';

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
                    <Route path="/food-form/:id" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <FoodForm />
                        </ProtectedRoute>}
                    />
                    <Route path="/update-food" element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <EditDiet />
                        </ProtectedRoute>}
                    />
                    <Route path="/food-form" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <FoodForm />
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
