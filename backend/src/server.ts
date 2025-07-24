import app from './app';
import dotenv from 'dotenv';
import db from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// start the server 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access API at http://localhost:${PORT}`);
})
