import { Router } from 'express'
import {
  addAddress,
  addToWishlist,
  deleteAddress,
  getAddresses,
  getWishlist,
  removeFromWishlist,
  updateAddress,
} from '../controllers/user.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(protectedRoute)

// address routes
router.post('/addresses', addAddress)
router.get('/addresses', getAddresses)
router.put('/addresses/:addressId', updateAddress)
router.delete('/addresses/:addressId', deleteAddress)

// wishlist routes
router.post('/wishlist', addToWishlist)
router.delete('/wishlist/:productId', removeFromWishlist)
router.get('/wishlist', getWishlist)

export default router
