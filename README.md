# 🐒 Monky PDV

Sistema de Ponto de Venda simples para pequenos comércios.
Desenvolvido para estudo e portfólio.

## 🚀 Funcionalidades

- Cadastro e gestão de produtos com controle de estoque
- Cadastro de clientes
- Registro de vendas com abatimento automático do estoque
- API REST completa

## 🛠️ Stack

- **Back-end:** Node.js + Express + TypeScript
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL (Supabase)
- **Deploy:** Vercel (em breve)

## 📁 Estrutura
```
backend/
├── prisma/        # schema, migrations e seed
└── src/
    ├── routes/        # definição das URLs
    ├── controllers/   # recebe e responde as requisições
    └── services/      # regras de negócio e acesso ao banco
```

## ▶️ Como rodar localmente
```bash
# instalar dependências
cd backend
npm install

# configurar o banco
cp .env.example .env
# preencha DATABASE_URL no .env

# rodar migrations
npx prisma migrate dev --config prisma/prisma.config.ts

# popular banco com dados de teste
npm run seed

# iniciar servidor
npm run dev
```

## 🔗 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| POST | `/produtos` | Cria novo produto |
| PUT | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Remove produto |

## 👨‍💻 Autor

Feito por **Leonardo Rosler Dos Santos** .
