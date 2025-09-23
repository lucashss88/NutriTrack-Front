# NutriTrack Frontend

Sistema de gerenciamento nutricional que conecta nutricionistas e pacientes para acompanhamento de dietas e planos alimentares.

## Funcionalidades Principais

### Para Nutricionistas
- Cadastro e gerenciamento de alimentos com informações nutricionais
- Criação e edição de dietas personalizadas com refeições
- Gerenciamento de pacientes e cálculo de IMC
- Visualização e acompanhamento de dietas dos pacientes
- Exportação de dietas em PDF e DOCX com formatação profissional
- Adição de refeições substitutas e observações

### Para Pacientes
- Visualização de dietas prescritas pelo nutricionista
- Acompanhamento do progresso alimentar
- Edição de refeições realizadas
- Acesso ao histórico de dietas
- Portal personalizado para interação com o plano alimentar

### Funcionalidades Gerais
- Sistema de autenticação com controle de acesso por perfil
- Interface responsiva e intuitiva
- Notificações em tempo real
- Proteção de rotas baseada em roles

## Stack Tecnológica

- **Frontend**: React 18.3.1
- **Roteamento**: React Router DOM 6.24.1
- **UI Framework**: Bootstrap 5.3.6 + React Bootstrap 2.10.10
- **Estilização**: CSS customizado + Tailwind CSS 4.1.10
- **HTTP Client**: Axios 1.3.1
- **Geração de Documentos**: jsPDF 2.5.1 + docx 8.5.0
- **Notificações**: React Toastify 10.0.5
- **Ícones**: Bootstrap Icons 1.13.1

## Como Rodar Localmente

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd nutritrack-front
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Configure a URL da API backend

4. Execute o projeto:
```bash
npm start
```

5. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Deploy

A aplicação está disponível online em: **[https://nutri-track-front.vercel.app/](https://nutri-track-front.vercel.app/)**

Deploy realizado na Vercel com integração contínua.

## Scripts Disponíveis

- `npm start` - Executa a aplicação em modo de desenvolvimento
- `npm test` - Executa os testes
- `npm run build` - Gera build de produção
- `npm run eject` - Ejeta as configurações do Create React App

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── diets/          # Componentes relacionados a dietas
│   │   ├── dietForm.js         # Formulário de criação de dietas
│   │   ├── editDietPatient.js  # Edição de dietas pelo paciente
│   │   ├── editDietNutricionist.js # Edição pelo nutricionista
│   │   ├── downloadDiets.js    # Geração de PDF/DOCX
│   │   └── viewDiet.js         # Visualização de dietas
│   ├── foods/          # Componentes de gerenciamento de alimentos
│   │   ├── foodForm.js         # Cadastro de alimentos
│   │   ├── listfoods.js        # Listagem de alimentos
│   │   └── viewFood.js         # Visualização de alimentos
│   └── patients/       # Componentes de pacientes
│       ├── listPatients.js     # Lista de pacientes
│       └── calcIMC.js          # Calculadora de IMC
├── pages/              # Páginas principais (login, home, etc.)
├── services/           # Serviços de API (axios)
├── context/            # Contextos React (auth, meals)
├── hooks/              # Hooks customizados (useAuth)
└── assets/             # Recursos estáticos (CSS, imagens)
```

## Repositórios

- **Frontend**: [https://github.com/lucashss88/NutriTrack-Front](https://github.com/lucashss88/NutriTrack-Front)
- **Backend**: [https://github.com/lucashss88/NutriTrack-Back](https://github.com/lucashss88/NutriTrack-Back)
