import { Router } from "express";
import { getOrders, getUserOrders, createOrder } from '../controllers/order.controller.js'

const router = Router()

router.get('/orders', getOrders)
      .get('/orders/:id', getUserOrders)
      .post('/orders', createOrder)

export default router