import { Router } from 'express';
import { addReview, deleteReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Route to add a review
router.post('/:id/reviews', protect, addReview);

// Route to delete a specific review by its ID
router.delete('/:id', protect, deleteReview);

export default router;