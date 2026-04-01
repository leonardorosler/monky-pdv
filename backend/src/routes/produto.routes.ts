import { Router } from 'express'
import * as ProdutoController from '../controllers/produto.controller.js'

const router = Router()

router.get('/', ProdutoController.listar)
router.get('/:id', ProdutoController.buscar)
router.post('/', ProdutoController.criar)
router.put('/:id', ProdutoController.atualizar)
router.delete('/:id', ProdutoController.deletar)

export default router