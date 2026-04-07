import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET as string

// Extende o tipo Request para aceitar o campo usuario
declare global {
  namespace Express {
    interface Request {
      usuario?: { id: number; nome: string; email: string }
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  // Token vem no header: "Bearer eyJhbGci..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, SECRET) as { id: number; nome: string; email: string }
    req.usuario = payload // anexa os dados do usuário na requisição
    next() // libera para a próxima função
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}