import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div>
            <h1>Acesso Negado</h1>
            <p>Você não tem permissão para acessar esta página.</p>
            <Link to="/mainPage">Voltar para a Página Principal</Link>
        </div>
    );
};

export default Unauthorized;
