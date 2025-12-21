import { Router } from 'express'
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cart.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(protectedRoute)

router.get('/', getCart)
router.post('/', addToCart)
router.put('/:productId', updateCartItem)
router.delete('/:productId', removeFromCart)
router.delete('/', clearCart)

export default router
