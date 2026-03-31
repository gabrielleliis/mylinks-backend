import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from './server' // Garanta que o caminho do seu server esteja correto

describe('API MyLinks - Rota de Usuários (/users)', () => {

  // 1. O teste que você começou (Caminho Triste)
  it('Deve retornar erro 400 (Zod) ao enviar e-mail inválido e senha curta', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: "Teste QA",
        email: "email-sem-arroba", // Erro proposital
        password: "123",           // Erro proposital
        slug: "qa-slug"
      })
    
    // A validação: Esperamos que o status HTTP seja 400 (Bad Request)
    expect(response.status).toBe(400)
    
    // Se a sua API retorna uma mensagem de erro no JSON, você pode testar assim:
    // expect(response.body).toHaveProperty('message') 
  })

  // 2. Novo teste: Criando o usuário com sucesso (Caminho Feliz)
  it('Deve criar um usuário com dados válidos e retornar status 201', async () => {
    // Gerando dados únicos para não dar erro no Prisma (Unique constraint)
    const emailUnico = `qa-${Date.now()}@teste.com`
    const slugUnico = `qa-slug-${Date.now()}`

    const response = await request(app)
      .post('/users')
      .send({
        name: "Gabriel QA",
        email: emailUnico,
        password: "senhaSegura123!",
        slug: slugUnico
      })
    
    // Esperamos que o status HTTP seja 201 (Created)
    expect(response.status).toBe(201)
    
    // Se o seu backend devolve o usuário recém-criado, verifique se o e-mail bate:
    // expect(response.body.email).toBe(emailUnico)
  })
})