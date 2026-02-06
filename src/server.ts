import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient(); // Conecta no banco
const port = 3333;

// Habilita o servidor a entender JSON (IMPORTANTE!)
app.use(express.json());

// Rota para ver se está tudo vivo
app.get('/', (req: Request, res: Response) => {
  res.json({ mensagem: 'API do MyLinks rodando com Database! 🚀' });
});

// Rota para CRIAR um Usuário (O poder do Prisma!)
app.post('/users', async (req: Request, res: Response) => {
  // Pegamos os dados que vieram na requisição
  const { email, password } = req.body;

  try {
    // O Prisma salva no banco magicamente
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    // Devolvemos o usuário criado para quem chamou
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ erro: 'Não foi possível criar o usuário' });
  }
});

// Rota para criar um Link novo
app.post('/links', async (req, res) => {
  // 1. Validamos os dados com o Zod (agora importado!)
  const createLinkSchema = z.object({
    title: z.string(),
    url: z.string(),
    userId: z.string().uuid(), // O ID do dono do link
  })

  const { title, url, userId } = createLinkSchema.parse(req.body)

  // 2. Salvamos no banco
  const newLink = await prisma.link.create({
    data: {
      title,
      url,
      userId,
    }
  })

  // 3. Devolvemos a resposta (201 = Criado)
  return res.status(201).json(newLink)
})

// Rota para LISTAR os links
app.get('/links', async (req, res) => {
  // O prisma vai no banco e busca TUDO que tem na tabela Link
  const links = await prisma.link.findMany()

  return res.json(links)
})

// Rota para DELETAR um link
app.delete('/links/:linkId', async (req, res) => {
  const { linkId } = req.params

  try {
    await prisma.link.delete({
      where: {
        id: linkId,
      },
    })

    return res.status(200).json({ message: "Link deletado com sucesso!" })
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar (O ID pode não existir)" })
  }
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});