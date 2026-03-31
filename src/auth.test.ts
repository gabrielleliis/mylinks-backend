import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from './server' 

describe('API MyLinks - Autenticação e Middleware', () => {
  let tokenJWT: string; 
  
  // Usamos um timestamp para garantir que o e-mail e slug sejam únicos a cada teste
  const emailValido = `auth-${Date.now()}@teste.com`;
  const senhaValida = "senhaForte123";

  // Passo 1: Criar o usuário antes de testar o login
  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({
        name: "Usuario Auth",
        email: emailValido,
        password: senhaValida,
        slug: `slug-auth-${Date.now()}`
      });
  });

  // ==========================================
  // TESTES DA ROTA DE LOGIN
  // ==========================================

  it('Deve retornar status 200 e um Token ao fazer login com dados corretos', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: emailValido,
        password: senhaValida
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token'); 
    
    // Salvamos o token gerado para usar nos testes do middleware!
    tokenJWT = response.body.token; 
  });

  it('Deve retornar status 400 com senha incorreta', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: emailValido,
        password: "senhaErradaDaPega"
      });

    // O seu server.ts retorna 400 para senha inválida
    expect(response.status).toBe(400); 
    expect(response.body.message).toBe('E-mail ou senha inválidos.');
  });

  it('Deve retornar status 400 com e-mail não cadastrado', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: "email-fantasma@teste.com",
        password: senhaValida
      });

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TESTES DO MIDDLEWARE (Proteção de Rotas)
  // ==========================================

  it('Deve bloquear requisição SEM token na rota /users/me e retornar status 401', async () => {
    const response = await request(app)
      .get('/users/me') // Rota que busca o perfil logado
      .send();

    // O middleware (authMiddleware) DEVE barrar e retornar 401 (Unauthorized)
    expect(response.status).toBe(401); 
  });

  it('Deve permitir requisição COM token válido na rota /users/me e retornar status 200', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${tokenJWT}`) // Passando o token no formato correto
      .send();

    expect(response.status).toBe(200);
    // Verifica se retornou os dados do usuário corretamente
    expect(response.body.user.email).toBe(emailValido);
  });
  
  it('Deve bloquear requisição com token INVÁLIDO/FALSO na rota /links', async () => {
    const response = await request(app)
      .get('/links') 
      .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...`) // Token inventado
      .send();

    expect(response.status).toBe(401);
  });
});