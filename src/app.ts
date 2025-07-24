/* import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import dotenv from 'dotenv';
import { mainRouter } from './routes'; // This correctly resolves to routes/index.ts

dotenv.config();

const app = new Hono();

// Health check
app.get('/health', (c) => c.text('OK'));

// Main router
app.route('/', mainRouter);

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.text('Internal Server Error', 500);
});

const port = Number(process.env.PORT) || 3000;
serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`Server running on http://localhost:${port}`);
});
 */


// src/app.ts

// --- IMPORTANT: dotenv.config() MUST BE CALLED FIRST ---
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables immediately

// Now, import other modules that might rely on process.env
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { mainRouter } from './routes';

// You can keep these debug logs for now, or remove them after confirming the fix
console.log('DEBUG: GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Loaded' : 'NOT LOADED');
console.log('DEBUG: GOOGLE_REFRESH_TOKEN:', process.env.GOOGLE_REFRESH_TOKEN ? 'Loaded' : 'NOT LOADED');

const app = new Hono();

// Health check
app.get('/health', (c) => c.text('OK'));

// Main router
app.route('/', mainRouter);

// Error handling
app.onError((err, c) => {
  console.error(err);
  return c.text('Internal Server Error', 500);
});

const port = Number(process.env.PORT) || 3000;
serve({
  fetch: app.fetch,
  port,
}, () => {
  console.log(`Server running on http://localhost:${port}`);
});
