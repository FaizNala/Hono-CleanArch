import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();


/**
 * Build PostgreSQL connection string from individual credentials
 */
function buildConnectionString(): string {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!user || !password || !database) {
    throw new Error(
      'Missing required database credentials. Please provide either DATABASE_URL or all of: DB_USER, DB_PASSWORD, DB_NAME'
    );
  }

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

/**
 * Get database connection string
 * Priority: DATABASE_URL > Individual credentials (DB_HOST, DB_PORT, etc.)
 */
function getConnectionString(): string {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (databaseUrl) {
    return databaseUrl;
  }

  return buildConnectionString();
}

const connectionString = getConnectionString();

const client = postgres(connectionString);

// Pass schema generic for Queries API compatibility
export const db = drizzle(client, { schema });
export { client };