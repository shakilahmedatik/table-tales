import { Router } from 'express'
import { createReview, deleteReview } from '../controllers/review.controller.js'
import { protectedRoute } from '../middlewares/auth.middleware.js'

const router = Router()
router.use(protectedRoute)

router.post('/', createReview)
router.delete('/:reviewId', deleteReview)

export default router
