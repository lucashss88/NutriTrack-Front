import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/NT2.png';
import useAuth from "../hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const { role } = useAuth();

    const roleName = () => {
        if (role === 'nutricionist'){
            return 'NUTRICIONISTA'
        } else {
            return 'PACIENTE'
        }
    }

    const features = () => {
        if (role === 'nutricionist'){
            const text = '- Ver Planos Nutricionais - Visualize facilmente seus planos alimentares e informações nutricionais. ' +
                ' - Adicionar novos alimentos - Os profissionais podem adicionar novos alimentos ao banco de dados. \n' +
                ' - Acompanhe os valores nutricionais - Acompanhe calorias, proteínas, carboidratos e gorduras. \n' +
                ' Comece a gerenciar sua nutrição hoje para um amanhã mais saudável!'
            return text;
        } else {
            return 'Ver Planos Nutricionais - Visualize facilmente seus planos alimentares e informações nutricionais.'
        }

    }

    return (
      <>
          <div className="home-container">
            <div>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={logo} className='logo-home'  alt="Logo"/>
            </div>
            <div className="text-home">
              <h2>Seja Bem-Vindo ao NutriTrack!</h2>
              <h3>VOCÊ É UM {roleName()}!</h3>
              <h4>Este aplicativo ajuda profissionais de saúde e pacientes a gerenciar planos alimentares de maneira eficaz.
                  <br></br>Funcionalidades: <br></br><br></br>
                  - Registro e Login de Usuários - Crie e acesse sua conta com segurança. <br></br>
                  {features()}
              </h4>
            </div>
          </div>
      </>
    );
};

export default Home;