// frontend/src/components/BookDetailPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axios';
import type { AxiosError } from 'axios';
import type { ApiError } from '../types';

interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    average_rating: number;
}

const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Wrapped in useCallback to memoize the function
    const fetchBookDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/books/${id}`);
            setBook(response.data.book);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setError(axiosError.response?.data?.message || 'Failed to fetch book details.');
        } finally {
            setLoading(false);
        }
    }, [id]); // id is a dependency of useCallback

    useEffect(() => {
        fetchBookDetails();
    }, [fetchBookDetails]); // Now fetchBookDetails is a dependency of useEffect

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {book && (
                <>
                    <h2>{book.title}</h2>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Average Rating:</strong> {book.average_rating ? book.average_rating.toFixed(2) : 'N/A'}</p>
                </>
            )}
        </div>
    );
};

export default BookDetailPage;