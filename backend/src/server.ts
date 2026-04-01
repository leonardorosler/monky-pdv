import 'dotenv/config'
import express from 'express'
import pkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pgPkg from 'pg'

const { PrismaClient } = pkg       // workaround para módulo CommonJS
const { Pool } = pgPkg

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.json({mensagem : "operação realizada com sucesso"})
})

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany()
    res.json(produtos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
})

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333')
})