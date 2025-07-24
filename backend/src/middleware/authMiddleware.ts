import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../types';
import pool from '../config/db';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// Middleware function to protect routes
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if(!jwtSecret) {
                console.error('JWT_SECRET is not defined in environment variables');
                return res.status(500).json({message: 'Server congiguration error'});
            }

            // Verify the token
            const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; username: string };

            // If user not found in DB, token is invalid or user was deleted
            const result = await pool.query('SELECT id, email, username FROM users WHERE id = $1', [decoded.id]);

            // Attach the user obj
            req.user = result.rows[0];

            next();
        } catch (error: any) {
            console.error('Token verification failed:', error.message);

            if (error.name == 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired' });
            }
            if (error.name == 'JsonWebTokenError') {
                return res.status(401).json({message: 'Not authroized, token failed'});
            }
            return res.status(500).json({ message: 'Server error during token verification.' });
        }
    }

    // If no token is provided 
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};