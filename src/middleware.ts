import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

// Criamos uma interface para dizer o que tem dentro do token
interface TokenPayload {
  userId: string
  iat: number
  exp: number
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado!' })
  }

  const [, token] = authHeader.split(' ')

  try {
    // AQUI MUDOU: A gente decodifica o token e pega o userId
    const decoded = verify(token, 'segredo-do-jwt') as TokenPayload
    
    // Salvamos o ID dentro da requisição para as próximas rotas usarem
    req.userId = decoded.userId

    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido!' })
  }
}