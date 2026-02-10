import cors from 'cors';
import express, { Request, Response } from 'express';
import { authMiddleware } from './middleware';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { upload } from './config/multer'; // <--- COMENTE ESSA LINHA ASSIM (COM DUAS BARRAS)

console.log("PASSO 1: Começou o script...")

const app = express();
app.use(cors());
console.log("PASSO 2: Conectando ao Prisma...")
const prisma = new PrismaClient();
const port = 3333; // <--- Garanta que está assim, limpo.

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ mensagem: 'API do MyLinks rodando com Database! 🚀' });
});

// ==================================================
// 1. ROTAS DE AUTENTICAÇÃO E USUÁRIO
// ==================================================

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

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, slug }
    })

    res.status(201).json({ message: "Usuário criado com sucesso!" })
    return

  } catch (err) {
    console.error("ERRO AO CRIAR USUÁRIO:", err) 

    if (err instanceof z.ZodError) {
       res.status(400).json({ message: err.issues[0].message })
       return
    }
    res.status(500).json({ message: "Erro interno. Verifique o terminal do servidor." })
    return
  }
})

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

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(400).json({ message: 'E-mail ou senha inválidos.' })
      return
    }

    const token = sign({ userId: user.id }, 'segredo-do-jwt', { expiresIn: '7d' })

    res.json({ 
      token, 
      user: { 
        name: user.name, 
        email: user.email, 
        slug: user.slug,
        avatarUrl: user.avatarUrl // Retorna a foto se tiver
      } 
    })
    return

  } catch (err) {
    console.error("ERRO NO LOGIN:", err)
    res.status(500).json({ message: "Erro interno." })
    return
  }
})

// --- NOVA ROTA DE ATUALIZAR PERFIL COM FOTO ---
app.put('/users', authMiddleware, upload.single('image'), async (req, res) => {
  const updateUserSchema = z.object({
    name: z.string().optional(),
  })

  try {
    // 1. Pega o nome do corpo da requisição (se tiver)
    const { name } = updateUserSchema.parse(req.body)
    
    // 2. Pega o arquivo enviado (se tiver)
    const file = req.file 

    // 3. Atualiza no Banco de Dados
    const updatedUser = await prisma.user.update({
      where: { id: req.userId }, // ID vindo do token (authMiddleware)
      data: {
        name: name || undefined, // Só atualiza se mandou nome novo
        avatarUrl: file ? file.path : undefined // Só atualiza se mandou foto nova
      }
    })

    res.json({ message: "Perfil atualizado!", user: updatedUser })

  } catch (err) {
    console.error("ERRO AO ATUALIZAR:", err)
    res.status(500).json({ message: "Erro ao atualizar perfil." })
  }
})

// ==================================================
// 2. ROTAS DE LINKS (DASHBOARD)
// ==================================================

app.post('/links', authMiddleware, async (req, res) => {
  const createLinkSchema = z.object({
    title: z.string(),
    url: z.string().url(),
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
    console.error("ERRO AO CRIAR LINK:", err)
    res.status(400).json({ message: "Dados inválidos." })
    return
  }
})

app.get('/links', authMiddleware, async (req, res) => {
  const links = await prisma.link.findMany({
    where: { userId: req.userId }
  })
  res.json(links)
  return
})

app.delete('/links/:linkId', authMiddleware, async (req, res) => {
  const { linkId } = req.params

  const result = await prisma.link.deleteMany({
    where: {
      id: linkId as string,
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
// 3. ROTA PÚBLICA (PERFIL)
// ==================================================

// ROTA PÚBLICA (Buscar usuário pelo slug)
  app.get('/:slug', async (req, res) => {
    const { slug } = req.params

    const user = await prisma.user.findUnique({
      where: { slug },
      include: { 
        links: true 
      },
      // APAGUEI O 'select' DAQUI, POIS ELE DÁ CONFLITO COM O 'include'
    })

    if (!user) {
      return res.status(404).json({ message: 'Perfil não encontrado' })
    }

    return res.json({ user })
  })

// ==================================================
// 4. LIGAR O SERVIDOR (O PASSO FINAL)
// ==================================================

console.log("PASSO 3: Tentando abrir a porta " + port + "...")

app.listen(port, () => {
  console.log(`✅ SUCESSO! Servidor rodando em http://localhost:${port}`);
});