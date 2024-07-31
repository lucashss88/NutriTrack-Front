import React from 'react';
import { useNavigate } from 'react-router-dom';

const Backbutton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <>
            <p onClick={handleBack} className='voltar'>Voltar</p>
        </>
    );
};

    export default Backbutton;