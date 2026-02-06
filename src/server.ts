import express, { Request, Response } from 'express';
import { authMiddleware } from './middleware';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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
app.post('/users', async (req, res) => {
  const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6), // Mínimo de 6 caracteres
  })

  const { email, password } = createUserSchema.parse(req.body)

  // 1. Criptografando a senha antes de salvar
  // O número 8 é o "custo" (quanto mais alto, mais seguro e mais lento)
  const passwordHash = await hash(password, 8)

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash, // AQUI: Salvamos a hash, não a senha pura!
      }
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ erro: 'Não foi possível criar o usuário (Email já existe?)' })
  }
})

// Rota de LOGIN (Autenticação)
app.post('/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = loginSchema.parse(req.body)

  // 1. Buscar o usuário pelo e-mail
  const user = await prisma.user.findUnique({
    where: { email }
  })

  // Se não achar o usuário, erro
  if (!user) {
    return res.status(400).json({ message: 'E-mail ou senha inválidos.' })
  }

  // 2. Comparar a senha enviada com a senha criptografada do banco
  const isPasswordValid = await compare(password, user.password)

  // Se a senha não bater, erro
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'E-mail ou senha inválidos.' })
  }

  // 3. Se tudo estiver certo, criar o Token
  const token = sign({ userId: user.id }, 'segredo-do-jwt', {
    expiresIn: '7d', // O token vale por 7 dias
  })

  return res.json({ token })
})

// Rota para criar um Link novo (AGORA AUTOMÁTICA)
app.post('/links', authMiddleware, async (req, res) => {
  
  // 1. O Zod NÃO pede mais o userId (Removemos ele daqui)
  const createLinkSchema = z.object({
    title: z.string(),
    url: z.string(),
  })

  const { title, url } = createLinkSchema.parse(req.body)

  // 2. Salvamos no banco usando o ID que o middleware pegou
  const newLink = await prisma.link.create({
    data: {
      title,
      url,
      userId: req.userId, // <--- O ID vem daqui agora! (Seguro)
    }
  })

  return res.status(201).json(newLink)
})

// Rota para LISTAR os links
app.get('/links', async (req, res) => {
  // O prisma vai no banco e busca TUDO que tem na tabela Link
  const links = await prisma.link.findMany()

  return res.json(links)
})

// Rota para DELETAR um link (Blindada 🛡️)
app.delete('/links/:linkId', authMiddleware, async (req, res) => {
  const { linkId } = req.params

  // Usamos deleteMany para garantir que só apaga se o ID bater E o dono for o usuário logado
  const result = await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId: req.userId, // <--- A Mágica: Só deleta se for SEU
    },
  })

  // O deleteMany retorna uma contagem. Se for 0, é porque não achou ou não é seu.
  if (result.count === 0) {
    return res.status(401).json({ message: "Link não encontrado ou você não tem permissão." })
  }

  return res.status(200).json({ message: "Link deletado com sucesso!" })
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});