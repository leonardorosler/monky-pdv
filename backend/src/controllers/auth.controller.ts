import { Request, Response } from 'express'
import * as AuthService from '../services/auth.service.js'

export async function registrar(req: Request, res: Response) {
  const { nome, email, senha } = req.body
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' })

  try {
    const usuario = await AuthService.registrar(nome, email, senha)
    res.status(201).json(usuario)
  } catch {
    res.status(400).json({ erro: 'Email já cadastrado' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body
  if (!email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos' })

  try {
    const resultado = await AuthService.login(email, senha)
    res.json(resultado)
  } catch (err: any) {
    res.status(401).json({ erro: err.message })
  }
}