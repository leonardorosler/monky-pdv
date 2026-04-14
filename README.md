# 🐒 Monky PDV

Sistema de Ponto de Venda simples para pequenos comércios.
Desenvolvido para estudo e portfólio durante o curso de ADS.

> ⚠️ Projeto em desenvolvimento ativo.

---

## 📸 Screenshots

<!-- Adicione os prints aqui -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->
<!-- ![PDV](./screenshots/pdv.png) -->
<!-- ![Produtos](./screenshots/produtos.png) -->

---

## 🚀 Funcionalidades

- Autenticação com JWT — login, token e logout
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

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|-----------|
| Front-end | React + TypeScript + Vite + CSS Modules |
| Back-end | Node.js + Express + TypeScript |
| ORM | Prisma 7 |
| Banco de dados | PostgreSQL (Supabase) |
| Autenticação | JWT + bcryptjs |

---

## 📁 Estrutura

```
monky-pdv/
├── frontend/
│   └── src/
│       ├── components/    # Layout, PageHeader
│       ├── hooks/         # useDebounce
│       ├── pages/         # Dashboard, PDV, Produtos, Clientes, Vendas, Login
│       └── services/      # configuração do axios com interceptors JWT
└── backend/
    ├── prisma/            # schema, migrations e seed
    └── src/
        ├── middlewares/   # autenticação JWT
        ├── routes/        # definição das URLs
        ├── controllers/   # recebe e responde as requisições
        └── services/      # regras de negócio e acesso ao banco
```

---

## ▶️ Como rodar localmente

```bash
# --- Backend ---
cd backend
npm install

cp .env.example .env
# preencha DATABASE_URL e JWT_SECRET no .env

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

### Variáveis de ambiente (`backend/.env`)

```env
DATABASE_URL="postgresql://usuario:senha@host/banco?sslmode=require"
JWT_SECRET="sua-chave-secreta"
```

---

## 🔗 Endpoints

### Autenticação (pública)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastra usuário |
| POST | `/auth/login` | Retorna token JWT |

### Produtos (requer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/produtos` | Lista produtos (aceita ?nome=) |
| GET | `/produtos/:id` | Busca por ID |
| POST | `/produtos` | Cria produto |
| PUT | `/produtos/:id` | Atualiza produto |
| DELETE | `/produtos/:id` | Remove produto |

### Clientes (requer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/clientes` | Lista clientes (aceita ?nome=) |
| GET | `/clientes/:id` | Busca por ID |
| POST | `/clientes` | Cria cliente |
| PUT | `/clientes/:id` | Atualiza cliente |
| DELETE | `/clientes/:id` | Remove cliente |

### Vendas (requer token)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/vendas` | Lista todas as vendas |
| GET | `/vendas/:id` | Busca por ID |
| POST | `/vendas` | Registra nova venda |
| GET | `/vendas/dashboard` | Dados do dashboard |

---

## 👨‍💻 Autor

Feito por **Leonardo Rosler Dos Santos** durante o curso de Análise e Desenvolvimento de Sistemas.
