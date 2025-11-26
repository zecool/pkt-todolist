import pg from 'pg';
import dotenv from 'dotenv';

// Ensure .env is loaded
dotenv.config();

const { Pool } = pg;

// Create a new pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper function to test connection
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Database connection successful:', res.rows[0]);
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
};

// Helper to query directly
const query = (text, params) => pool.query(text, params);

export { pool, query, testConnection };
