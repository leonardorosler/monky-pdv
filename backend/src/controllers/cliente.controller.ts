import { Request, Response } from 'express'
import * as ClienteService from '../services/cliente.service.js'

export async function listar(req: Request, res: Response) {
  const clientes = await ClienteService.listarClientes()
  res.json(clientes)
}

export async function buscar(req: Request, res: Response) {
  const cliente = await ClienteService.buscarCliente(Number(req.params.id))
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' })
  res.json(cliente)
}

export async function criar(req: Request, res: Response) {
  const { nome, email } = req.body
  const cliente = await ClienteService.criarCliente(nome, email)
  res.status(201).json(cliente)
}

export async function atualizar(req: Request, res: Response) {
  const cliente = await ClienteService.atualizarCliente(Number(req.params.id), req.body)
  res.json(cliente)
}

export async function deletar(req: Request, res: Response) {
  await ClienteService.deletarCliente(Number(req.params.id))
  res.status(204).send()
}