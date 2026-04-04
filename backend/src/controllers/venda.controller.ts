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
  const { itens, formaPagamento, clienteId } = req.body
  const venda = await VendaService.criarVenda(itens, formaPagamento ?? 'dinheiro', clienteId)
  res.status(201).json(venda)
}

export async function dashboard(req: Request, res: Response) {
  const [resumo, maisVendidos, faturamento] = await Promise.all([
    VendaService.resumoHoje(),
    VendaService.produtosMaisVendidos(),
    VendaService.faturamentoPorDia()
  ])
  res.json({ resumo, maisVendidos, faturamento })
}