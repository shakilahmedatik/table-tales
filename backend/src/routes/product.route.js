import { Router } from 'express'
import { getAllProducts } from '../controllers/admin.controller.js'
import { getProductById } from '../controllers/product.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(protectedRoute)

router.get('/', getAllProducts)
router.get('/:id', getProductById)

export default router
