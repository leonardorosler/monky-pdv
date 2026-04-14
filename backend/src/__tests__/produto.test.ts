import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../routes/auth.routes.js'
import produtoRoutes from '../routes/produto.routes.js'
import { autenticar } from '../middlewares/auth.middleware.js'
import { prisma } from '../prisma.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/produtos', autenticar, produtoRoutes)

let token: string
let produtoId: number

beforeAll(async () => {
  // Garante que o usuário de teste existe
  await prisma.usuario.upsert({
    where: { email: 'teste@jest.com' },
    update: {},
    create: {
      nome: 'Teste',
      email: 'teste@jest.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // senha: password
    }
  })

  // Faz login e salva o token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'teste@jest.com', senha: 'password' })

  token = res.body.token
})

afterAll(async () => {
  await prisma.produto.deleteMany({ where: { nome: 'Produto Teste Jest' } })
  await prisma.$disconnect()
})

describe('POST /produtos', () => {
  it('deve criar um produto', async () => {
    const res = await request(app)
      .post('/produtos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Produto Teste Jest', preco: 9.99, estoque: 10 })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.nome).toBe('Produto Teste Jest')
    produtoId = res.body.id
  })

  it('deve rejeitar requisição sem token', async () => {
    const res = await request(app)
      .post('/produtos')
      .send({ nome: 'Sem token', preco: 1, estoque: 1 })

    expect(res.status).toBe(401)
  })
})

describe('GET /produtos', () => {
  it('deve listar produtos', async () => {
    const res = await request(app)
      .get('/produtos')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('deve buscar produto por nome', async () => {
    const res = await request(app)
      .get('/produtos?nome=Jest')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0].nome).toContain('Jest')
  })
})

describe('PUT /produtos/:id', () => {
  it('deve atualizar o estoque do produto', async () => {
    const res = await request(app)
      .put(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estoque: 99 })

    expect(res.status).toBe(200)
    expect(res.body.estoque).toBe(99)
  })
})

describe('DELETE /produtos/:id', () => {
  it('deve deletar o produto', async () => {
    const res = await request(app)
      .delete(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })
})