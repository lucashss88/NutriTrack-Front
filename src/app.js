import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainPage from './pages/mainPage';
import DietForm from './components/diets/dietForm';
import Login from './pages/login';
import Register from './pages/register';
import ListFoods from './components/foods/listfoods';
import FoodForm from './components/foods/foodForm';
import ProtectedRoute from './components/protectedRoute';
import Home from './pages/home';
import EditDietPatient from './components/diets/editDietPatient';
import ListDietsForNutricionist from './components/diets/listDietsForNutricionist';
import ListDietsForPatient from './components/diets/listDietsForPatient';
import ViewDiet from './components/diets/viewDiet';
import ViewFood from './components/foods/viewFood';
import EditDietNutricionist from './components/diets/editDietNutricionist';
import ListPatients from './components/patients/listPatients';
import AddMealForm from './components/diets/addMealForm';
import Unauthorized from './components/unauthorized';
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
import './assets/styles/downloadModal.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "./pages/layout";
import EditUser from './pages/editUser';

const App = () => {
    return (
        <Router>
            <Layout>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
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
                    <Route path="/edit-profile" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <EditUser />
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
                    <Route path="/view-food/:id" element={
                        <ProtectedRoute allowedRoles={['nutricionist']}>
                            <ViewFood />
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
                    <Route path="/home" element={
                        <ProtectedRoute allowedRoles={['nutricionist', 'patient']}>
                            <Home />
                        </ProtectedRoute>}
                    />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
