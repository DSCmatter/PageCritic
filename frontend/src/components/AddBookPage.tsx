import React, { useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import type { ApiError } from '../types'; 

const AddBookPage = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            const response = await apiClient.post('/books', { title, author, genre });
            setMessage(response.data.message);
            setTitle('');
            setAuthor('');
            setGenre('');
            setTimeout(() => navigate('/books'), 2000);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>; 
            setError(axiosError.response?.data?.message || 'Failed to add book.');
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Book</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
                <button type="submit">Add Book</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default AddBookPage;