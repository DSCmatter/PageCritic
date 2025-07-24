import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import reviewRoutes from './routes/reviewRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req,res) => {
    res.send("Book review platform API is running!");
});

// TODO: Import and use your API routes here (e.g., authRoutes, bookRoutes, reviewRoutes)

// Use your API routes
app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth
app.use('/api/books', bookRoutes); // All book routes will be prefixed with /api/books
app.use('/api/books', reviewRoutes); // Get Reviews of books
app.use('/api/reviews', reviewRoutes); // All review routes will be prefixed with /api/reviews

// Error handling middleware 
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;