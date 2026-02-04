import express, { Request, Response } from 'express';
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});