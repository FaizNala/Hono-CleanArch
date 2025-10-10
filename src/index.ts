import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { routes } from './presentation/routes/routes.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'Clean Architecture Backend with Hono.js + Drizzle + Supabase',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route('/api', routes);

// Error handling
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found',
    message: 'The requested resource was not found',
  }, 404);
});

const port = Number(process.env.PORT) || 3000;
serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`🚀 Server is running on http://localhost:${info.port}`);
  console.log(`📚 API Documentation: http://localhost:${info.port}/api/v1`);
});
