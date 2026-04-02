import { prisma } from '../prisma.js'

export async function listarProdutos(nome?: string) {
  return prisma.produto.findMany({
    where: nome ? {
      nome: { contains: nome, mode: 'insensitive' } // busca parcial, ignora maiúsculas
    } : undefined
  })
}

export async function buscarProduto(id: number) {
  return prisma.produto.findUnique({ where: { id } })
}

export async function criarProduto(nome: string, preco: number, estoque: number) {
  return prisma.produto.create({
    data: { nome, preco, estoque }
  })
}

export async function atualizarProduto(id: number, dados: Partial<{ nome: string; preco: number; estoque: number }>) {
  return prisma.produto.update({
    where: { id },
    data: dados
  })
}

export async function deletarProduto(id: number) {
  return prisma.produto.delete({ where: { id } })
}