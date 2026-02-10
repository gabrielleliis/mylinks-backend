# 🔗 MyLinks

O **MyLinks** é uma plataforma completa de agregação de links (estilo Linktree), desenvolvida para centralizar sua presença digital em um único lugar. Com ele, usuários podem criar perfis personalizados, gerenciar links e acompanhar métricas de acesso em tempo real.

![Preview do Projeto](https://placehold.co/1200x400/8257e5/FFF?text=MyLinks+Preview)
*(Em breve: Imagem real do dashboard)*

## 🚀 Funcionalidades

-   ✅ **Autenticação Segura:** Sistema de Login e Cadastro de contas.
-   ✅ **Dashboard Administrativo:** Painel para adicionar, editar e excluir links.
-   ✅ **Página Pública:** Perfil único (ex: `mylinks.com/seu-nome`) acessível externamente.
-   ✅ **Analytics em Tempo Real:** Contador de cliques para monitorar o engajamento de cada link.
-   ✅ **Customização de Perfil:** Upload de foto de perfil e edição de dados do usuário.
-   📱 **Design Responsivo:** Interface moderna e adaptada para dispositivos móveis e desktop.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas do ecossistema JavaScript/TypeScript moderno:

### Backend (API)
-   **Node.js** & **Fastify**: Framework web focado em performance e baixa latência.
-   **TypeScript**: Tipagem estática para maior segurança e produtividade.
-   **Prisma ORM**: Manipulação de banco de dados (PostgreSQL/SQLite).
-   **Zod**: Validação rigorosa de dados de entrada.
-   **JWT**: Autenticação via JSON Web Token.

### Frontend (Web)
-   **React.js** & **Vite**: Biblioteca para construção de interfaces rápidas.
-   **TypeScript**: Integração perfeita com o backend.
-   **CSS Moderno**: Estilização responsiva com foco em UX/UI.
-   **React Router DOM**: Gerenciamento de rotas da aplicação (SPA).

## 📂 Estrutura do Projeto

O repositório está organizado como um monorepo contendo tanto o servidor quanto o cliente web:

-   📂 **`/server`**: API RESTful, Regras de Negócio e Banco de Dados.
-   📂 **`/web`**: Interface do Usuário (Frontend).

## 🎲 Como Rodar Localmente

Siga os passos abaixo para executar o projeto na sua máquina:

### Pré-requisitos
Certifique-se de ter instalado:
-   [Node.js](https://nodejs.org/) (v18 ou superior)
-   [Git](https://git-scm.com/)

### 1. Clone o repositório
```bash
git clone [https://github.com/gabrielleliis/mylinks-backend.git](https://github.com/gabrielleliis/mylinks-backend.git)
cd mylinks-backend

2. Configurando o Backend (Servidor)
Abra um terminal, entre na pasta do servidor e instale as dependências:

Bash
cd server
npm install
Crie um arquivo .env na raiz da pasta server (ou use as configurações padrão do Prisma para SQLite localmente):

Bash
# Execute as migrações para criar as tabelas no banco de dados
npx prisma migrate dev

# Inicie o servidor
npm run dev
🚀 O servidor estará rodando em: http://localhost:3333

3. Configurando o Frontend (Web)
Abra um segundo terminal (mantenha o anterior rodando), entre na pasta web e inicie a interface:

Bash
cd web
npm install
npm run dev
🎨 Acesse a aplicação em: http://localhost:5173

🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

<p align="center"> Feito com 💜 por <a href="https://www.google.com/search?q=https://github.com/gabrielleliis">Gabriel Lelis</a> </p>