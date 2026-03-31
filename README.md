# 🔗 MyLinks

O **MyLinks** é uma plataforma completa de agregação de links (estilo Linktree), criada para centralizar toda a presença digital do usuário em um único lugar. A aplicação permite criar perfis personalizados, gerenciar links e acompanhar métricas de acesso em tempo real.

![Preview do Projeto](https://placehold.co/1200x400/8257e5/FFF?text=MyLinks+Preview)

---

## 🚀 Funcionalidades

- ✅ **Autenticação Segura** — Sistema de login e cadastro de usuários  
- ✅ **Dashboard Administrativo** — Painel para adicionar, editar e excluir links  
- ✅ **Página Pública** — Perfil único acessível externamente  
- ✅ **Analytics em Tempo Real** — Contador de cliques para monitorar engajamento  
- ✅ **Customização de Perfil** — Upload de foto e edição de dados  
- 📱 **Design Responsivo** — Interface moderna para mobile e desktop  

---

## 🛠️ Tecnologias Utilizadas

**Backend**
- Node.js  
- Fastify  
- Prisma ORM  
- Zod  
- JWT  

**Frontend**
- React.js  
- Vite  
- TypeScript  
- CSS Modules  

**Banco de Dados**
- SQLite (Desenvolvimento)  
- PostgreSQL (Produção)  

---

## 🧪 Qualidade e Testes Automatizados

Este projeto foi construído com foco em resiliência e qualidade de código. O backend conta com uma suíte de testes de integração e testes de unidade garantindo o funcionamento do CRUD e das regras de negócio.

- **Ferramentas:** Vitest e Supertest.
- **Cobertura atual:** ~80% de test coverage (Statements).
- **Cenários validados:**
  - Criação de usuários e proteção de duplicidade no banco (Prisma).
  - Sistema de Autenticação (JWT) e validação de rotas protegidas por Middleware.
  - CRUD completo de links do Dashboard.
  - Rotas públicas de perfil e contabilização de cliques.
  - Validação de schemas e payloads com Zod.

## 📂 Como Rodar Localmente

Siga o passo a passo abaixo para executar o projeto na sua máquina.

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/gabrielleliis/mylinks-backend.git
cd mylinks-backend
```

---

### 2️⃣ Configurando o Backend (Servidor)

Abra um terminal na pasta do servidor e instale as dependências:

```bash
cd server
npm install
```

Crie o arquivo `.env` (se necessário), execute as migrações e inicie o servidor:

```bash
npx prisma migrate dev
npm run dev
```

🚀 O servidor estará rodando em:  
**http://localhost:3333**

---

### 3️⃣ Configurando o Frontend (Web)

Abra um segundo terminal, entre na pasta do frontend e inicie o projeto:

```bash
cd web
npm install
npm run dev
```

🎨 Acesse a aplicação em:  
**http://localhost:5173**

---

<p align="center">
Feito com 💜 por  
<a href="https://github.com/gabrielleliis">Gabriel Lelis</a>
</p>
