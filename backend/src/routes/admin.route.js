import { Router } from 'express'
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats,
} from '../controllers/admin.controller.js'
import { protectedRoute, adminOnly } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

// optimization - DRY
router.use(protectedRoute, adminOnly)

router.post('/products', upload.array('images', 3), createProduct)
router.get('/products', getAllProducts)
router.put('/products/:id', upload.array('images', 3), updateProduct)
router.delete('/products/:id', deleteProduct)

router.get('/orders', getAllOrders)
router.patch('/orders/:orderId/status', updateOrderStatus)

router.get('/customers', getAllCustomers)

router.get('/stats', getDashboardStats)

export default router
