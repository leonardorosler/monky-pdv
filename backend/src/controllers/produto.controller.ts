import { Request, Response } from 'express'
import * as ProdutoService from '../services/produto.service.js'

export async function listar(req: Request, res: Response) {
  const produtos = await ProdutoService.listarProdutos()
  res.json(produtos)
}

export async function buscar(req: Request, res: Response) {
  const produto = await ProdutoService.buscarProduto(Number(req.params.id))
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' })
  res.json(produto)
}

export async function criar(req: Request, res: Response) {
  const { nome, preco, estoque } = req.body
  const produto = await ProdutoService.criarProduto(nome, preco, estoque)
  res.status(201).json(produto)
}

export async function atualizar(req: Request, res: Response) {
  const produto = await ProdutoService.atualizarProduto(Number(req.params.id), req.body)
  res.json(produto)
}

export async function deletar(req: Request, res: Response) {
  await ProdutoService.deletarProduto(Number(req.params.id))
  res.status(204).send()
}