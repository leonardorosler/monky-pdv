import { prisma } from '../prisma.js'

interface ItemCarrinho {
  produtoId: number
  quantidade: number
  precoUnit: number
}

export async function criarVenda(
  itens: ItemCarrinho[],
  formaPagamento: string,
  clienteId?: number
) {
  const total = itens.reduce((soma, item) => soma + item.precoUnit * item.quantidade, 0)

  const venda = await prisma.venda.create({
    data: {
      total,
      formaPagamento,
      clienteId: clienteId ?? null,
      itens: {
        create: itens.map(item => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnit: item.precoUnit
        }))
      }
    },
    include: { itens: true }
  })

  for (const item of itens) {
    await prisma.produto.update({
      where: { id: item.produtoId },
      data: { estoque: { decrement: item.quantidade } }
    })
  }

  return venda
}

export async function listarVendas() {
  return prisma.venda.findMany({
    orderBy: { criadoEm: 'desc' },
    include: {
      itens: { include: { produto: true } },
      cliente: true
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

// Queries do dashboard
export async function resumoHoje() {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const vendas = await prisma.venda.findMany({
    where: { criadoEm: { gte: hoje } },
    include: { itens: true }
  })

  const totalFaturado = vendas.reduce((soma, v) => soma + v.total, 0)
  const totalItens = vendas.reduce((soma, v) =>
    soma + v.itens.reduce((s, i) => s + i.quantidade, 0), 0)

  return {
    totalVendas: vendas.length,
    totalFaturado,
    totalItens
  }
}

export async function produtosMaisVendidos() {
  const itens = await prisma.itemVenda.groupBy({
    by: ['produtoId'],
    _sum: { quantidade: true },
    orderBy: { _sum: { quantidade: 'desc' } },
    take: 5
  })

  const comNomes = await Promise.all(itens.map(async item => {
    const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } })
    return {
      nome: produto?.nome ?? 'Desconhecido',
      quantidade: item._sum.quantidade ?? 0
    }
  }))

  return comNomes
}

export async function faturamentoPorDia() {
  const seteDiasAtras = new Date()
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 6)
  seteDiasAtras.setHours(0, 0, 0, 0)

  const vendas = await prisma.venda.findMany({
    where: { criadoEm: { gte: seteDiasAtras } },
    select: { total: true, criadoEm: true }
  })

  // Agrupa por dia
  const porDia: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const chave = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
    porDia[chave] = 0
  }

  for (const venda of vendas) {
    const chave = new Date(venda.criadoEm).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })
    if (porDia[chave] !== undefined) porDia[chave] += venda.total
  }

  return Object.entries(porDia).map(([dia, total]) => ({ dia, total }))
}