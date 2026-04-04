# 🐒 Monky PDV

Sistema de Ponto de Venda simples para pequenos comércios.
Desenvolvido para estudo e portfólio durante o curso de ADS.

## 🚀 Funcionalidades

- PDV com busca de produto por texto e carrinho interativo
- Seleção de cliente na venda (opcional)
- Formas de pagamento: dinheiro, cartão de crédito, débito e pix
- Cálculo de troco automático
- Abatimento automático do estoque ao finalizar venda
- Dashboard com faturamento do dia, itens vendidos e gráfico dos últimos 7 dias
- Produtos mais vendidos em tempo real
- Cadastro e gestão de produtos com alerta de estoque baixo
- Cadastro e gestão de clientes
- Histórico de vendas com detalhamento por item
- API REST completa

## 🛠️ Stack

- **Front-end:** React + TypeScript + Vite + CSS Modules
- **Back-end:** Node.js + Express + TypeScript
- **ORM:** Prisma 7
- **Banco de dados:** PostgreSQL (Supabase)
- **Deploy:** Vercel (em breve)

## 📁 Estrutura

```
monky-pdv/
├── frontend/
│   └── src/
│       ├── components/    # Layout, PageHeader
│       ├── hooks/         # useDebounce
│       ├── pages/         # Dashboard, PDV, Produtos, Clientes, Vendas
│       └── services/      # configuração do axios
└── backend/
    ├── prisma/            # schema, migrations e seed
    └── src/
        ├── routes/        # definição das URLs
        ├── controllers/   # recebe e responde as requisições
        └── services/      # regras de negócio e acesso ao banco
```

## ▶️ Como rodar localmente

```bash
# --- Backend ---
cd backend
npm install

cp .env.example .env
# preencha DATABASE_URL no .env com a URL do Supabase

npx prisma migrate dev --config prisma/prisma.config.ts
npm run seed
npm run dev
# servidor em http://localhost:3333

# --- Frontend ---
cd frontend
npm install
npm run dev
# interface em http://localhost:5173
```

## 🔗 Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos` | Lista produtos (aceita ?nome=) |
| GET | `/produtos/:id` | Busca produto por ID |
| POST | `/produtos` | Cria produto |
| PUT | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Remove produto |
| GET | `/clientes` | Lista clientes (aceita ?nome=) |
| GET | `/clientes/:id` | Busca cliente por ID |
| POST | `/clientes` | Cria cliente |
| PUT | `/clientes/:id` | Atualiza cliente |
| DELETE | `/clientes/:id` | Remove cliente |
| GET | `/vendas` | Lista todas as vendas |
| GET | `/vendas/:id` | Busca venda por ID |
| POST | `/vendas` | Registra nova venda |
| GET | `/vendas/dashboard` | Dados do dashboard |

## 👨‍💻 Autor

Feito por **Leonardo Rosler Dos Santos**.