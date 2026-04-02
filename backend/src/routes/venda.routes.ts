import { Router } from 'express'
import * as VendaController from '../controllers/venda.controller.js'

const router = Router()

router.get('/', VendaController.listar)
router.get('/:id', VendaController.buscar)
router.post('/', VendaController.criar)

export default router