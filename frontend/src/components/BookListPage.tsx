// frontend/src/components/BookListPage.tsx

import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import type { ApiError } from '../types';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    average_rating: number;
}

export const BookListPage = () => {
    const { isAuthenticated } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterGenre, setFilterGenre] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get('/books', {
                    params: {
                        page,
                        genre: filterGenre || undefined,
                        author: filterAuthor || undefined,
                    },
                });

                // --- DEBUGGING LOGS ---
                console.log("API call successful.");
                console.log("API Response Status:", response.status);
                console.log("API Response Data:", response.data);
                // ---------------------

                setBooks(response.data.books || []);
                setTotalPages(response.data.pagination.totalPages);
            } catch (err) {
                const axiosError = err as AxiosError<ApiError>;
                const errorMessage = axiosError.response?.data?.message || 'Failed to fetch books. Check your backend server and network.';
                console.error("API call failed:", errorMessage);
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [page, filterGenre, filterAuthor]);

    const handleDeleteBook = async (bookId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this book?');
        if (!confirmDelete) return;

        try {
            await apiClient.delete(`/books/${bookId}`);
            setBooks(books.filter(book => book.id !== bookId));
            alert('Book deleted successfully!');
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            alert(axiosError.response?.data?.message || 'Failed to delete book.');
        }
    };

    return (
        <div>
            <h2>Book List</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="Filter by genre"
                    value={filterGenre}
                    onChange={(e) => {
                        setPage(1);
                        setFilterGenre(e.target.value);
                    }}
                />
                <input
                    type="text"
                    placeholder="Filter by author"
                    value={filterAuthor}
                    onChange={(e) => {
                        setPage(1);
                        setFilterAuthor(e.target.value);
                    }}
                />
            </form>
            {loading && <p>Loading books...</p>}

            {/* Add this line to display the error */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {(!loading && books.length === 0) && <p>No books found.</p>}
            <div className="book-list">
                {books.map(book => (
                    <div key={book.id} className="book-card">
                        <Link to={`/books/${book.id}`}>
                            <h3>{book.title}</h3>
                        </Link>
                        <p>by {book.author}</p>
                        <p>Genre: {book.genre}</p>
                        <p>Avg. Rating: {book.average_rating ? book.average_rating.toFixed(2) : 'N/A'}</p>
                        {isAuthenticated && (
                            <button onClick={() => handleDeleteBook(book.id)}>Delete Book</button>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <button onClick={() => setPage(page => Math.max(page - 1, 1))} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={() => setPage(page => page + 1)} disabled={page >= totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};