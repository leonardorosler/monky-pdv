import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'

const SECRET = process.env.JWT_SECRET as string

export async function registrar(nome: string, email: string, senha: string) {
  const senhaHash = await bcrypt.hash(senha, 10) // criptografa a senha com 10 rounds

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash }
  })

  return { id: usuario.id, nome: usuario.nome, email: usuario.email }
}

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario) throw new Error('Usuário não encontrado')

  const senhaValida = await bcrypt.compare(senha, usuario.senha) // compara a senha com o hash
  if (!senhaValida) throw new Error('Senha incorreta')

  // Gera o token com os dados do usuário — expira em 8 horas
  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    SECRET,
    { expiresIn: '8h' }
  )

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } }
}
