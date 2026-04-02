import { prisma } from '../prisma.js'

export async function listarClientes() {
  return prisma.cliente.findMany()
}

export async function buscarCliente(id: number) {
  return prisma.cliente.findUnique({ where: { id } })
}

export async function criarCliente(nome: string, email: string) {
  return prisma.cliente.create({
    data: { nome, email }
  })
}

export async function atualizarCliente(id: number, dados: Partial<{ nome: string; email: string }>) {
  return prisma.cliente.update({
    where: { id },
    data: dados
  })
}

export async function deletarCliente(id: number) {
  return prisma.cliente.delete({ where: { id } })
}