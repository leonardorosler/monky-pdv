import request from 'supertest'
import express from 'express'
import cors from 'cors'
import authRoutes from '../routes/auth.routes.js'
import produtoRoutes from '../routes/produto.routes.js'
import vendaRoutes from '../routes/venda.routes.js'
import { autenticar } from '../middlewares/auth.middleware.js'
import { prisma } from '../prisma.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/auth', authRoutes)
app.use('/produtos', autenticar, produtoRoutes)
app.use('/vendas', autenticar, vendaRoutes)

let token: string
let produtoId: number

beforeAll(async () => {
  const login = await request(app)
    .post('/auth/login')
    .send({ email: 'teste@jest.com', senha: 'password' })

  token = login.body.token

  // Cria produto para usar na venda
  const produto = await request(app)
    .post('/produtos')
    .set('Authorization', `Bearer ${token}`)
    .send({ nome: 'Produto Venda Jest', preco: 5.00, estoque: 50 })

  produtoId = produto.body.id
})

afterAll(async () => {
  await prisma.itemVenda.deleteMany({
    where: { produto: { nome: 'Produto Venda Jest' } }
  })
  await prisma.produto.deleteMany({ where: { nome: 'Produto Venda Jest' } })
  await prisma.$disconnect()
})

describe('POST /vendas', () => {
  it('deve registrar uma venda e abater o estoque', async () => {
    const res = await request(app)
      .post('/vendas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        formaPagamento: 'dinheiro',
        itens: [{ produtoId, quantidade: 3, precoUnit: 5.00 }]
      })

    expect(res.status).toBe(201)
    expect(res.body.total).toBe(15)

    // Verifica se o estoque foi abatido
    const produto = await request(app)
      .get(`/produtos/${produtoId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(produto.body.estoque).toBe(47) // 50 - 3
  })

  it('deve rejeitar venda sem itens', async () => {
    const res = await request(app)
      .post('/vendas')
      .set('Authorization', `Bearer ${token}`)
      .send({ formaPagamento: 'pix', itens: [] })

    expect(res.status).toBe(400)
  })
})

describe('GET /vendas/dashboard', () => {
  it('deve retornar dados do dashboard', async () => {
    const res = await request(app)
      .get('/vendas/dashboard')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('resumo')
    expect(res.body).toHaveProperty('maisVendidos')
    expect(res.body).toHaveProperty('faturamento')
  })
})