import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { AuthProvider } from './authContext';
import { MealsProvider } from './mealsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
      <AuthProvider>
        <MealsProvider>
          <App /> 
        </MealsProvider>
      </AuthProvider>
    </React.StrictMode>
);



