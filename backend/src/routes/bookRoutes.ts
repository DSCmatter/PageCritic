import { Router } from 'express';
import { addBook, getBooks, getBookById, deleteBook } from '../controllers/bookController'; 
import { protect } from '../middleware/authMiddleware'; 

const router = Router();

// Public routes
router.get('/', getBooks);           // Get all books with filters/pagination
router.get('/:id', getBookById);     // Get single book details with reviews

// Private routes (requires authentication)
router.post('/', protect, addBook);  // Add a new book

router.delete('/:id', protect, deleteBook); // Delete a book by ID

export default router;