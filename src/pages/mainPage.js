import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/NT.png';

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="main-container">
                <div>
                    <img src={logo} className='logo-main' />
                </div>
                <div className='main-block'>
                    <button onClick={() => navigate('/login')} className='button-main loginbt'>Login</button>
                    <button onClick={() => navigate('/register')} className='button-main registerbt'>Registrar</button>
                </div>
            </div>
        </>
    );
};

export default MainPage;