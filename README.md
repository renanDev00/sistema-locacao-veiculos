Aplicação Full Stack para gerenciamento de frota e locação de veículos, desenvolvida com Node.js, Express, Prisma ORM, MySQL, autenticação JWT e React com TypeScript.

## Integrantes

- Renan de Araujo Venturini Silva

## Funcionalidades

- Cadastro e autenticação de usuários com senha criptografada (`bcrypt`) e token `JWT`.
- Cadastro e listagem de veículos com controle e filtro de disponibilidade.
- Registro de locações com validação de datas, cálculo automático de diárias no backend e controle transacional de disponibilidade.
- Consulta de histórico individual de locações e finalização com registro da data efetiva de devolução.

## Decisões Gerais e Arquitetura

- **Backend em Camadas:** Separação entre `routes` (endpoints), `middlewares` (autenticação JWT e validação de entrada com Zod), `controllers` (requisição/resposta HTTP), `services` (regras de negócio) e `databases` (instância única do Prisma Client com driver adapter MariaDB/MySQL).
- **Segurança e Autorização:** Senhas armazenadas com hash `bcrypt` e nunca retornadas nas respostas da API; identificação do locatário extraída exclusivamente do token JWT (`req.usuarioId`), impedindo consulta ou finalização de locações de terceiros.
- **Cálculo de Diárias e Concorrência:** O valor total da locação é calculado no servidor arredondando qualquer fração de 24 horas para diária completa (`Math.ceil`). O registro e a finalização utilizam `prisma.$transaction` com atualização condicional (`updateMany` verificando `disponivel: true`) para evitar locações simultâneas no mesmo veículo.
- **Frontend Componentizado:** Interface em React + TypeScript organizada em `pages`, `components`, `services`, `types` e `api` (Axios com interceptors para envio automático do cabeçalho `Authorization: Bearer <token>`).

## Requisitos de Execução

- Node.js (v18 ou superior)
- MySQL ou MariaDB (ex.: XAMPP)

## Configuração do Banco de Dados

1. Inicie o serviço MySQL/MariaDB.
2. Crie o banco de dados:

   ```sql
   CREATE DATABASE locadora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   ```

3. Copie backend/.env.example para backend/.env e preencha DATABASE_URL, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT e JWT_SECRET.

## Instalação e Execução

### Backend

```Bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

A API será iniciada em http://localhost:3000.

### Frontend

```Bash
cd frontend
npm install
npm run dev
```

A interface web será iniciada em http://localhost:5173.
