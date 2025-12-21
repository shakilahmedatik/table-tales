import { Router } from 'express'

import { createOrder, getUserOrders } from '../controllers/order.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', protectedRoute, createOrder)
router.get('/', protectedRoute, getUserOrders)

export default router
