import 'dotenv/config'
import express from 'express'
import produtoRoutes from './routes/produto.routes.js'
import clienteRoutes from './routes/cliente.routes.js'
import vendaRoutes from './routes/venda.routes.js'

const app = express()
app.use(express.json())

app.use('/produtos', produtoRoutes)
app.use('/clientes', clienteRoutes)
app.use('/vendas', vendaRoutes)

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333')
})