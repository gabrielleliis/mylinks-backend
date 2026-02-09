import cors from 'cors';
import express, { Request, Response } from 'express';
import { authMiddleware } from './middleware';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs'; // Importamos hash e compare direto
import { sign } from 'jsonwebtoken';

const app = express();
app.use(cors());
const prisma = new PrismaClient();
const port = 3333;

app.use(express.json());

// Rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json({ mensagem: 'API do MyLinks rodando com Database! 🚀' });
});

// ==================================================
// 1. ROTAS DE AUTENTICAÇÃO E USUÁRIO
// ==================================================

// Cadastro (Register)
app.post('/users', async (req, res) => {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  })

  try {
    const { name, email, password, slug } = createUserSchema.parse(req.body)

    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      res.status(409).json({ message: "E-mail já existe." })
      return
    }

    const slugExists = await prisma.user.findUnique({ where: { slug } })
    if (slugExists) {
      res.status(409).json({ message: "Este link já está em uso." })
      return
    }

    // CORREÇÃO: Usamos 'hash' direto, não 'bcrypt.hash'
    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, slug }
    })

    res.status(201).json({ message: "Usuário criado com sucesso!" })
    return

  } catch (err) {
    if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.issues[0].message })
        return
    }
    res.status(500).json({ message: "Erro interno." })
    return
  }
})

// Login
app.post('/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      res.status(400).json({ message: 'E-mail ou senha inválidos.' })
      return
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      res.status(400).json({ message: 'E-mail ou senha inválidos.' })
      return
    }

    const token = sign({ userId: user.id }, 'segredo-do-jwt', { expiresIn: '7d' })

    res.json({ token })
    return

  } catch (err) {
    res.status(500).json({ message: "Erro interno ou dados inválidos." })
    return
  }
})

// ==================================================
// 2. ROTAS DE LINKS (DASHBOARD)
// ==================================================

// Criar Link
app.post('/links', authMiddleware, async (req, res) => {
  const createLinkSchema = z.object({
    title: z.string(),
    url: z.string().url(), // Adicionei validação de URL válida
  })

  try {
    const { title, url } = createLinkSchema.parse(req.body)

    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        userId: req.userId,
      }
    })

    res.status(201).json(newLink)
    return
  } catch (err) {
    res.status(400).json({ message: "Dados inválidos." })
    return
  }
})

// Listar MEUS Links (Autenticado)
// OBS: Removi a rota duplicada que listava tudo sem senha. Esta é a correta.
app.get('/links', authMiddleware, async (req, res) => {
  const links = await prisma.link.findMany({
    where: {
      userId: req.userId 
    }
  })

  res.json(links)
  return
})

// Deletar Link
app.delete('/links/:linkId', authMiddleware, async (req, res) => {
  const { linkId } = req.params

  const result = await prisma.link.deleteMany({
    where: {
      id: linkId,
      userId: req.userId,
    },
  })

  if (result.count === 0) {
    res.status(401).json({ message: "Link não encontrado ou permissão negada." })
    return
  }

  res.status(200).json({ message: "Link deletado com sucesso!" })
  return
})

// ==================================================
// 3. ROTA PÚBLICA (PERFIL) - TEM QUE SER A ÚLTIMA!
// ==================================================

// Se essa rota ficasse lá em cima, o Express acharia que "/links" era um usuário chamado "links".
// Por isso, rotas com parâmetros dinâmicos (:slug) sempre ficam no final.
app.get('/:slug', async (req, res) => {
  const { slug } = req.params

  const user = await prisma.user.findUnique({
    where: { slug: slug },
    select: { 
      id: true,
      name: true,
      email: true,
      slug: true
    }
  })

  if (!user) {
    res.status(404).json({ message: "Perfil não encontrado" })
    return
  }

  const links = await prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  res.json({ user, links })
  return
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});