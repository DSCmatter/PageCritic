
import { Response } from 'express';
import pool from '../config/db';
import { AuthenticatedRequest, Review } from '../types';

// @desc    Add a review and rating to a book
// @route   POST /api/books/:id/reviews
// @access  Private (requires token)

export const addReview = async (req: AuthenticatedRequest, res: Response) => {
    const bookId = req.params.id; // Get the book ID from the URL parameters
    const { review_text, rating } = req.body; // Get review text and rating from the request body
    const reviewerId = req.user?.id; // Get the reviewer's ID from the authenticated user (attached by protect middleware)

    // validation
    if (!review_text || !rating) {
        return res.status(400).json({ message: 'Please provide both review text and a rating.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    if (!reviewerId) {
        // This case should ideally not be reached if protect middleware works correctly
        return res.status(401).json({ message: 'Not authorized, reviewer ID missing.' });
    }

    try {
        // check if the book exists
        const bookExists = await pool.query('SELECT id FROM books WHERE id = $1', [bookId]);
        if (bookExists.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        const newReviewResult = await pool.query(
            'INSERT INTO reviews (book_id, reviewer_id, review_text, rating) VALUES ($1, $2, $3, $4) RETURNING id, book_id, reviewer_id, review_text, rating, created_at',
            [bookId, reviewerId, review_text, rating]
        );

        const newReview: Review = newReviewResult.rows[0];

        res.status(201).json({
            message: 'Review added successfully',
            review: newReview,
        });
    } catch (error: any) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ message: 'Server error while adding review.' });
    }
};

// @desc    Delete a review by ID
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
    const reviewId = req.params.id; // Get the review ID from the URL parameters
    const userId = req.user?.id;    // Get the authenticated user's ID

    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, user ID missing.' });
    }

    try {
        // First, check if the review exists and if the authenticated user is the reviewer
        const reviewResult = await pool.query(
            'SELECT reviewer_id FROM reviews WHERE id = $1',
            [reviewId]
        );

        if (reviewResult.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        const reviewOwnerId = reviewResult.rows[0].reviewer_id;

        // Check if the logged-in user is the owner of the review
        if (reviewOwnerId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review. You can only delete your own reviews.' });
        }

        // Delete the review
        await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

        res.status(200).json({ message: 'Review deleted successfully.' });

    } catch (error: any) {
        console.error('Error deleting review:', error.message);
        res.status(500).json({ message: 'Server error while deleting review.' });
    }
};