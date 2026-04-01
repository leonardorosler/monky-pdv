import pkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const { PrismaClient } = pkg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  await prisma.produto.createMany({
    data: [
      { nome: 'Caneta Azul',    preco: 1.50,  estoque: 100 },
      { nome: 'Caderno 96fls',  preco: 12.90, estoque: 50  },
      { nome: 'Borracha',       preco: 0.75,  estoque: 200 },
      { nome: 'Lápis HB',       preco: 0.90,  estoque: 150 },
      { nome: 'Régua 30cm',     preco: 2.50,  estoque: 80  },
    ]
  })
  console.log('Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())