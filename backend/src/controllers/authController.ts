import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import pool from '../config/db'; 
import { AuthenticatedRequest, User } from '../types'; 
import dotenv from 'dotenv';

dotenv.config();

// Get JWT secret
// const jwtSecret = process.env.JWT_SECRET;
// const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

const generateToken = (id: string, email: string, username: string): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as unknown as jwt.SignOptions['expiresIn'];

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign({ id, email, username }, secret, { expiresIn });
};

export const signupUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user already exists by email or username
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User with that email or username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Insert new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, hashedPassword]
        );

        const user: User = newUser.rows[0];

        // Generate JWT token for the new user
        const token = generateToken(user.id, user.email, user.username);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token, // Send the token back to the client
        });
    } catch (error: any) {
        console.error('Error during user signup:', error.message);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check if user exists by email
        const userResult = await pool.query('SELECT id, username, email, password FROM users WHERE email = $1', [email]);

        const user: User = userResult.rows[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password!); // Use ! to assert password is not undefined

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for the authenticated user
        const token = generateToken(user.id, user.email, user.username);

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            token, // Send the token back to the client
        });
    } catch (error: any) {
        console.error('Error during user login:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    if (req.user) {
        res.status(200).json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};