import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import cors from 'cors'
import express from 'express'
import request from 'supertest'

import { prisma } from '../prisma.js'
import authRoutes from '../routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)

// Limpa o usuario de teste antes e depois.
beforeAll(async () => {
  await prisma.usuario.deleteMany({ where: { email: 'teste@jest.com' } })
})

afterAll(async () => {
  await prisma.usuario.deleteMany({ where: { email: 'teste@jest.com' } })
  await prisma.$disconnect()
})

describe('POST /auth/register', () => {
  it('deve cadastrar um novo usuario', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'Teste', email: 'teste@jest.com', senha: '123456' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('email', 'teste@jest.com')
  })

  it('deve rejeitar email duplicado', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ nome: 'Teste', email: 'teste@jest.com', senha: '123456' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve rejeitar campos vazios', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'teste@jest.com' })

    expect(res.status).toBe(400)
  })
})

describe('POST /auth/login', () => {
  it('deve retornar token com credenciais validas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'teste@jest.com', senha: '123456' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('usuario')
  })

  it('deve rejeitar senha incorreta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'teste@jest.com', senha: 'errada' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('erro')
  })

  it('deve rejeitar email inexistente', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'naoexiste@jest.com', senha: '123456' })

    expect(res.status).toBe(401)
  })
})
