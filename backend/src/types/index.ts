// Interfaces for databases

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    created_at: Date;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    created_at: Date;
    average_rating?: number;
}

export interface Review {
    id: string;
    book_id: string;
    reviewer_id: string;
    reviewer_text: string;
    rating: number;
    created_at: Date;
    reviewer_username?: string; 
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
    };
}