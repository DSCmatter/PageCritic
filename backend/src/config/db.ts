import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('--- Environment Variables Loaded ---');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE); // This is the crucial one
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('----------------------------------');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
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