import 'dotenv/config'
import express from 'express'
import produtoRoutes from './routes/produto.routes.js'

const app = express()
app.use(express.json())

app.use('/produtos', produtoRoutes)

app.listen(3333, () => {
  console.log('Servidor rodando em http://localhost:3333')
})