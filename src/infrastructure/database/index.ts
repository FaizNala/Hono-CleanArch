import { drizzle } from 'drizzle-orm/postgres-js';
import postgres = require('postgres');
import * as dotenv from 'dotenv';

dotenv.config();

// Database connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client);

// Export client for cleanup if needed
export { client };