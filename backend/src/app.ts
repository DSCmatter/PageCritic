import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req,res) => {
    res.send("Book review platform API is running!");
});

// TODO: Import and use your API routes here (e.g., authRoutes, bookRoutes, reviewRoutes)

// Error handling middleware 
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;