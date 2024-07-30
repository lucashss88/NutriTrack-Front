import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/images/NT2.png';
import { useAuth } from './authContext';

const Home = () => {
    const navigate = useNavigate();
    const { role } = useAuth();

    return (
      <>
          <div className="home-container">
            <div>
              <img src={logo} className='logo-home' />
            </div>
            <div className="text-home">
              <h1>Welcome to the Nutritrack!</h1>
              <h2>You are a {role}</h2>
              <h3>This app helps health professionals and patients manage dietary plans effectively.
                  <br></br>Features: <br></br>
                  - **User Registration & Login**: Securely create and access your account.
                  <br></br> - **View Nutrition Plans**: Easily view your dietary plans and nutritional information.
                  <br></br> - **Add New Foods**: Professionals can add new food items to the database.
                  <br></br> - **Track Nutritional Values**: Keep track of calories, protein, carbs, and fats.
                  <br></br> Start managing your nutrition today for a healthier tomorrow!
              </h3>
            </div>
            <div className='home-block'>
              <button onClick={() => navigate('/listdiets')} className='button-home'>Listar Dieta</button>
                {role !== 'patient' && (
                    <>
                        <button onClick={() => navigate('/listfoods')} className='button-home'>Listar Alimentos</button>
                        <button onClick={() => navigate('/diet-form')} className='button-home'>Criar Dieta</button>
                        <button onClick={() => navigate('/food-form')} className='button-home'>Criar Alimento</button>
                    </>
                )}
                {role !== 'nutricionist' && (
                    <>
                        {/*<button onClick={() => navigate('/update-food')} className='button-home'>Criar Dieta</button>*/}
                    </>
                )}
            </div>
          </div>
      </>
    );
};

export default Home;