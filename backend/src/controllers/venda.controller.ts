import { Request, Response } from 'express'
import * as VendaService from '../services/venda.service.js'

export async function listar(req: Request, res: Response) {
  const vendas = await VendaService.listarVendas()
  res.json(vendas)
}

export async function buscar(req: Request, res: Response) {
  const venda = await VendaService.buscarVenda(Number(req.params.id))
  if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' })
  res.json(venda)
}

export async function criar(req: Request, res: Response) {
  const { itens, clienteId } = req.body
  const venda = await VendaService.criarVenda(itens, clienteId)
  res.status(201).json(venda)
}