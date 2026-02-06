import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado!' })
  }

  // O token vem assim: "Bearer eyJhbG..."
  // Vamos dividir para pegar só o código
  const [, token] = authHeader.split(' ')

  try {
    verify(token, 'segredo-do-jwt')
    return next() // Pode passar!
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido!' })
  }
}