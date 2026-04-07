import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import produtoRoutes from './routes/produto.routes.js'
import clienteRoutes from './routes/cliente.routes.js'
import vendaRoutes from './routes/venda.routes.js'
import authRoutes from './routes/auth.routes.js'
import { autenticar } from './middlewares/auth.middleware.js'

const app = express()
app.use(cors())
app.use(express.json())

// Rota pública — não precisa de token
app.use('/auth', authRoutes)

// Rotas protegidas — precisam de token válido
app.use('/produtos', autenticar, produtoRoutes)
app.use('/clientes', autenticar, clienteRoutes)
app.use('/vendas', autenticar, vendaRoutes)

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333')
})