import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from './server' 

describe('API MyLinks - CRUD de Links e Rotas Públicas', () => {
  let tokenJWT: string;
  let userSlug: string;
  let createdLinkId: string; // Para guardarmos o ID do link criado e deletarmos depois

  // Preparação: Precisamos de um usuário logado para criar os links
  beforeAll(async () => {
    const email = `links-${Date.now()}@teste.com`;
    userSlug = `slug-links-${Date.now()}`;
    const password = "senhaForte123";

    // 1. Cria o usuário
    await request(app).post('/users').send({
      name: "Usuario dos Links",
      email,
      password,
      slug: userSlug
    });

    // 2. Faz o login para pegar o Token
    const loginResponse = await request(app).post('/login').send({ email, password });
    tokenJWT = loginResponse.body.token;
  });

  // ==========================================
  // TESTES DE CRIAÇÃO (CREATE)
  // ==========================================

  it('Deve criar um novo link e retornar status 201', async () => {
    const response = await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${tokenJWT}`)
      .send({
        title: "Meu Portfólio GitHub",
        url: "https://github.com/gabriel"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe("Meu Portfólio GitHub");
    
    // Salva o ID do link para usarmos nos testes de clique e deleção!
    createdLinkId = response.body.id; 
  });

  it('Deve retornar erro 400 ao tentar criar link com URL inválida', async () => {
    const response = await request(app)
      .post('/links')
      .set('Authorization', `Bearer ${tokenJWT}`)
      .send({
        title: "Link Quebrado",
        url: "isso-nao-e-uma-url" // Erro proposital pro Zod barrar
      });

    expect(response.status).toBe(400);
  });

  // ==========================================
  // TESTES DE LEITURA (READ / ROTAS PÚBLICAS)
  // ==========================================

  it('Deve listar os links do usuário logado (Dashboard)', async () => {
    const response = await request(app)
      .get('/links')
      .set('Authorization', `Bearer ${tokenJWT}`)
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); // Garante que tem pelo menos o link que criamos
  });

  it('Deve carregar o perfil público pelo slug com os links', async () => {
    const response = await request(app)
      .get(`/${userSlug}`) // Ex: GET /slug-links-123456
      .send();

    expect(response.status).toBe(200);
    expect(response.body.user.slug).toBe(userSlug);
    expect(Array.isArray(response.body.user.links)).toBe(true);
  });

  it('Deve computar um clique no link', async () => {
    const response = await request(app)
      .post(`/links/${createdLinkId}/click`) // Rota de clique
      .send();

    // No seu server.ts, o clique retorna 200 com status vazio .send()
    expect(response.status).toBe(200);
  });

  // ==========================================
  // TESTES DE DELEÇÃO (DELETE)
  // ==========================================

  it('Deve deletar um link existente e retornar status 200', async () => {
    const response = await request(app)
      .delete(`/links/${createdLinkId}`)
      .set('Authorization', `Bearer ${tokenJWT}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Link deletado com sucesso!");
  });

  it('Deve retornar erro 401 ao tentar deletar um link que não existe', async () => {
    const response = await request(app)
      .delete('/links/id-inventado-que-nao-existe')
      .set('Authorization', `Bearer ${tokenJWT}`)
      .send();

    // No seu server, se o count for 0, ele devolve 401
    expect(response.status).toBe(401);
  });
});