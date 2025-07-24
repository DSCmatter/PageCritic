import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false // Use SSL in production if your hosting requires it
});

pool.connect()
    .then(client => {
        console.log('Connected to the database successfully');
        client.release();
    })
.catch(err => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the process if connection fails
    });

export default pool;