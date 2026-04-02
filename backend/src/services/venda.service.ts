import { prisma } from '../prisma.js'

// Tipo que representa cada item do carrinho vindo do frontend
interface ItemCarrinho {
  produtoId: number
  quantidade: number
  precoUnit: number
}

export async function criarVenda(itens: ItemCarrinho[], clienteId?: number) {
  // Calcula o total somando preço x quantidade de cada item
  const total = itens.reduce((soma, item) => soma + item.precoUnit * item.quantidade, 0)

  // Cria a venda e os itens em uma única operação no banco
  const venda = await prisma.venda.create({
    data: {
      total,
      clienteId: clienteId ?? null,
      itens: {
        create: itens.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnit: item.precoUnit
        }))
      }
    },
    include: { itens: true } // retorna a venda já com os itens
  })

  // Abate o estoque de cada produto vendido
  for (const item of itens) {
    await prisma.produto.update({
      where: { id: item.produtoId },
      data: { estoque: { decrement: item.quantidade } } // subtrai do estoque
    })
  }

  return venda
}

export async function listarVendas() {
  return prisma.venda.findMany({
    include: {
      itens: { include: { produto: true } }, // traz os produtos de cada item
      cliente: true                           // traz o cliente da venda
    }
  })
}

export async function buscarVenda(id: number) {
  return prisma.venda.findUnique({
    where: { id },
    include: {
      itens: { include: { produto: true } },
      cliente: true
    }
  })
}