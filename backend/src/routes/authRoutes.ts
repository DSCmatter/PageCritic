// backend/src/routes/authRoutes.ts

import { Router } from 'express';
import { signupUser, loginUser, getMe } from '../controllers/authController'; // Import controller functions
import { protect } from '../middleware/authMiddleware'; // Import the protect middleware

const router = Router();

// Public routes
router.post('/signup', signupUser); // Route for user registration
router.post('/login', loginUser);   // Route for user login

// Private routes (requires authentication)
router.get('/me', protect, getMe);  // Route to get the current user's profile

export default router;