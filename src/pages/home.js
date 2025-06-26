import React from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '../assets/images/NTBW.png';
import useAuth from "../hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const {role} = useAuth();

    const roleName = () => {
        if (role === 'nutricionist') {
            return 'NUTRICIONISTA'
        } else {
            return 'PACIENTE'
        }
    }

    const getFeatures = () => {
        if (role === 'nutricionist') {
            return [
                {
                    title: "Gerenciar Planos Nutricionais",
                    description: "Crie, visualize e edite planos alimentares para seus pacientes.",
                    icon: "bi bi-clipboard-pulse",
                    link: "/nutricionist/diets"
                },
                {
                    title: "Adicionar e Gerenciar Alimentos",
                    description: "Expanda o banco de dados de alimentos com novas opções.",
                    icon: "bi bi-plus-circle",
                    link: "/listfoods"
                },
                {
                    title: "Acompanhar Pacientes",
                    description: "Monitore o progresso nutricional e os dados de seus pacientes.",
                    icon: "bi bi-people",
                    link: "/listpatients"
                },
                {
                    title: "Visualizar Relatórios",
                    description: "Acesse relatórios e estatísticas detalhadas sobre planos e progresso.",
                    icon: "bi bi-graph-up",
                    status: "Em Breve"
                }
            ];
        } else {
            return [
                {
                    title: "Ver Meu Plano Nutricional",
                    description: "Visualize facilmente seu plano alimentar atual e informações nutricionais.",
                    icon: "bi bi-journal-check",
                    link: "/patient/diets"
                },
                {
                    // eslint-disable-next-line no-useless-concat
                    title: "Acompanhar Minha Evolução",
                    description: "Monitore seu consumo de calorias, proteínas, carboidratos e gorduras.",
                    icon: "bi bi-activity",
                    status: "Em Breve"
                },
                {
                    title: "Recursos Educacionais",
                    description: "Aprenda mais sobre nutrição e hábitos saudáveis com artigos e dicas.",
                    icon: "bi bi-book",
                    status: "Em Breve"
                },
            ];
        }
    };

    return (

        <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center px-5 px-md-0 mb-3">
            <div className="dashboard-header text-center shadow-sm">
                <img src={logo} className='logo-home mb-3' alt="Logo"/>
                <h2 className="welcome-text mb-2">Seja Bem-Vindo ao NutriTrack!</h2>
                <h3 className="role-text mb-3">VOCÊ É UM {roleName()}!</h3>
                <p className="app-description px-3">
                    Este aplicativo ajuda profissionais de saúde e pacientes a gerenciar planos alimentares de
                    maneira eficaz, rumo a um amanhã mais saudável!
                </p>
            </div>
            <div className="container features-section">
                <h4 className="text-center mb-5 text-nutritrack-green fw-bold">Principais Funcionalidades para
                    Você:</h4>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                    {getFeatures().map((feature, index) => (
                        <div className="col" key={index}>
                            <div
                                className={`card h-100 card-feature ${feature.status === "Em Breve" ? 'opacity-75' : ''}`} // Diminui a opacidade para "Em Breve"
                                onClick={() => feature.status !== "Em Breve" && navigate(feature.link)} // Desabilita o clique se "Em Breve"
                                style={{ cursor: feature.status === "Em Breve" ? 'not-allowed' : 'pointer' }} // Altera o cursor
                            >
                                <div className="card-body">
                                    <div className="icon-circle mb-3">
                                        <i className={`bi ${feature.icon}`}></i>
                                    </div>
                                    <h5 className="card-title fw-bold text-nutritrack-text-dark">
                                        {feature.title}
                                        {feature.status && <span className="badge badge-soon ms-2">{feature.status}</span>}
                                    </h5>
                                    <p className="card-text text-nutritrack-text-muted">{feature.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="container mt-5 text-center">
                <p className="lead text-nutritrack-text-muted">
                    Comece a gerenciar sua nutrição hoje para um amanhã mais saudável!
                </p>
                {role === 'patient' && (
                    <button
                        className="btn btn-lg btn-success" // Mantendo o botão primário do Bootstrap
                        onClick={() => navigate('/patient/diets')}
                    >
                        <i className="bi bi-star me-2"></i> Explorar Meu Plano
                    </button>
                )}
                {role === 'nutricionist' && (
                    <button
                        className="btn btn-lg btn-outline-success" // Mantendo o botão primário do Bootstrap
                        onClick={() => navigate('/listpatients')}
                    >
                        <i className="bi bi-arrow-right me-2"></i> Começar a Gerenciar Pacientes
                    </button>
                )}
            </div>
        </div>

    );
};

export default Home;