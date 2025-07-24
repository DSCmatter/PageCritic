import { Response } from 'express';
import pool from '../config/db';
import { Book, Review, AuthenticatedRequest } from '../types';

// @desc    Add a new book
// @route   POST /api/books
// @access  Private (requires token)
export const addBook = async (req: AuthenticatedRequest, res: Response) => {
    const { title, author, genre } = req.body;

    //validation
    if (!title || !author || !genre) {
        return res.status(400).json({ message: 'Please enter all book fields: title, author, and genre.' });
    }

    try {
        // Optional: Check if a book with the same title and author already exists to prevent duplicates
        const existingBook = await pool.query(
            'SELECT id FROM books WHERE title = $1 AND author = $2',
            [title, author]
        );

        if (existingBook.rows.length > 0) {
            return res.status(409).json({ message: 'A book with this title and author already exists.' });
        }

        // Insert the new book into the database
        const newBookResult = await pool.query(
            'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING id, title, author, genre, created_at',
            [title, author, genre]
        );

        const newBook: Book = newBookResult.rows[0];

        res.status(201).json({
            message: 'Book added successfully',
            book: newBook,
        });
    } catch (error: any) {
        console.error('Error adding book:', error.message);
        res.status(500).json({ message: 'Server error while adding book.' });
    }
};

// @desc    Get all books with pagination and optional filters
// @route   GET /api/books
// @access  Public
export const getBooks = async (req: AuthenticatedRequest, res: Response) => {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Filtering parameters
    const genre = req.query.genre as string | undefined;
    const author = req.query.author as string | undefined;

    let query = `
        SELECT
            b.id,
            b.title,
            b.author,
            b.genre,
            b.created_at,
            COALESCE(AVG(r.rating), 0)::numeric(10, 2) AS average_rating -- Calculate average rating
        FROM
            books b
        LEFT JOIN
            reviews r ON b.id = r.book_id
    `;
    let countQuery = 'SELECT COUNT(*) FROM books b';
    const queryParams: (string | number)[] = [];
    const countQueryParams: (string | number)[] = [];
    let whereClauses: string[] = [];

    // Apply filters if provided
    if (genre) {
        whereClauses.push(`b.genre ILIKE $${queryParams.length + 1}`); // ILIKE for case-insensitive search
        queryParams.push(`%${genre}%`);
        countQueryParams.push(`%${genre}%`);
    }
    if (author) {
        whereClauses.push(`b.author ILIKE $${queryParams.length + 1}`);
        queryParams.push(`%${author}%`);
        countQueryParams.push(`%${author}%`);
    }

    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
        countQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += `
        GROUP BY
            b.id
        ORDER BY
            b.created_at DESC -- Default sorting by creation date (newest first)
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
    `;
    queryParams.push(limit, offset);

    try {
        const totalBooksResult = await pool.query(countQuery, countQueryParams);
        const totalBooks = parseInt(totalBooksResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalBooks / limit);

        const booksResult = await pool.query(query, queryParams);
        const books: Book[] = booksResult.rows;

        res.status(200).json({
            books,
            pagination: {
                totalBooks,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    } catch (error: any) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ message: 'Server error while fetching books.' });
    }
};


// @desc    Get a single book by ID with its reviews and average rating
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req: AuthenticatedRequest, res: Response) => {
    const bookId = req.params.id;

    try {
        // Fetch book details and calculate average rating
        const bookQuery = `
            SELECT
                b.id,
                b.title,
                b.author,
                b.genre,
                b.created_at,
                COALESCE(AVG(r.rating), 0)::numeric(10, 2) AS average_rating
            FROM
                books b
            LEFT JOIN
                reviews r ON b.id = r.book_id
            WHERE
                b.id = $1
            GROUP BY
                b.id;
        `;
        const bookResult = await pool.query(bookQuery, [bookId]);

        if (bookResult.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        const book: Book = bookResult.rows[0];

        // Fetch all reviews for this book, including reviewer's username
        const reviewsQuery = `
            SELECT
                r.id,
                r.review_text,
                r.rating,
                r.created_at,
                u.username AS reviewer_username -- Get username from users table
            FROM
                reviews r
            JOIN
                users u ON r.reviewer_id = u.id
            WHERE
                r.book_id = $1
            ORDER BY
                r.created_at DESC;
        `;
        const reviewsResult = await pool.query(reviewsQuery, [bookId]);
        const reviews: Review[] = reviewsResult.rows;

        res.status(200).json({
            book,
            reviews,
        });
    } catch (error: any) {
        console.error('Error fetching book details:', error.message);
        res.status(500).json({ message: 'Server error while fetching book details.' });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private (requires token) - Consider adding admin role check in a real app
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
    const bookId = req.params.id; // Get the book ID from the URL parameters
    const userId = req.user?.id; // Get the authenticated user's ID

    if (!userId) {
        // This check is mainly for the 'protect' middleware. If it fails, something is wrong.
        return res.status(401).json({ message: 'Not authorized, user ID missing.' });
    }

    try {
        // check if the book exists
        const bookExists = await pool.query('SELECT id FROM books WHERE id = $1', [bookId]);
        if (bookExists.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        await pool.query('DELETE FROM books WHERE id = $1', [bookId]);

        res.status(200).json({ message: 'Book deleted successfully.' });

    } catch (error: any) {
        console.error('Error deleting book:', error.message);
        res.status(500).json({ message: 'Server error while deleting book.' });
    }
};