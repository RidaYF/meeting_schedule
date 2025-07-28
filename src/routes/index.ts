/* import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static'
import { getAvailableSlots, scheduleMeeting } from '../api/calendar'; // Import new scheduleMeeting
import { suggestMeetingTimes } from '../api/ai';

export const mainRouter = new Hono();

// Serve static files from the 'public' directory
mainRouter.get('/*', serveStatic({ root: './public' }));

// API endpoint to get Gemini suggestions based on a user prompt
mainRouter.post('/suggest', async (c) => {
  try {
    const { prompt } = await c.req.json(); // Get prompt from request body
    if (!prompt) {
      return c.text('Prompt is required', 400);
    }
    const events = await getAvailableSlots(); // Still fetch events for context
    const suggestion = await suggestMeetingTimes(events, prompt); // Pass prompt to AI
    return c.text(suggestion);
  } catch (error) {
    console.error('Error in /suggest:', error);
    return c.text('An error occurred while getting suggestions.', 500);
  }
});

// API endpoint to schedule a new meeting
mainRouter.post('/schedule', async (c) => {
  try {
    const { summary, start, end, attendees } = await c.req.json();
    if (!summary || !start || !end) {
      return c.json({ error: 'Meeting summary, start, and end times are required.' }, 400);
    }

    const scheduledEvent = await scheduleMeeting({ summary, start, end, attendees });
    return c.json(scheduledEvent); // Return the created event details
  } catch (error: any) {
    console.error('Error in /schedule:', error);
    // Provide a more specific error message if possible
    return c.json({ error: error.message || 'An error occurred while scheduling the meeting.' }, 500);
  }
});

// API endpoint to get existing calendar events
mainRouter.get('/events', async (c) => {
  try {
    const events = await getAvailableSlots();
    return c.json(events); // Return events as JSON
  } catch (error) {
    console.error('Error in /events:', error);
    return c.json({ error: 'An error occurred while fetching calendar events.' }, 500);
  }
});

 */

 import { Hono } from 'hono';
// import { serveStatic } from 'hono/dist/middleware/static'; // No longer needed for root static files

// Import your API functions
import { getAvailableSlots, scheduleMeeting } from '../api/calendar';
import { suggestMeetingTimes } from '../api/ai';

export const mainRouter = new Hono();

// We are removing the serveStatic for '/*' here because Vercel's `routes`
// configuration in vercel.json will now handle serving public/index.html
// and other static assets directly.
// If you have other static assets that are NOT directly in the public root
// (e.g., /assets/images), you might need to re-evaluate this.
// For now, assuming index.html is the main static file.

// API endpoint to get Gemini suggestions based on a user prompt
mainRouter.post('/suggest', async (c) => {
  try {
    const { prompt } = await c.req.json();
    if (!prompt) {
      return c.text('Prompt is required', 400);
    }
    const events = await getAvailableSlots();
    const suggestion = await suggestMeetingTimes(events, prompt);
    return c.text(suggestion);
  } catch (error) {
    console.error('Error in /suggest:', error);
    return c.text('An error occurred while getting suggestions.', 500);
  }
});

// API endpoint to schedule a new meeting
mainRouter.post('/schedule', async (c) => {
  try {
    const { summary, start, end, attendees } = await c.req.json();
    if (!summary || !start || !end) {
      return c.json({ error: 'Meeting summary, start, and end times are required.' }, 400);
    }

    const scheduledEvent = await scheduleMeeting({ summary, start, end, attendees });
    return c.json(scheduledEvent);
  } catch (error: any) {
    console.error('Error in /schedule:', error);
    return c.json({ error: error.message || 'An error occurred while scheduling the meeting.' }, 500);
  }
});

// API endpoint to get existing calendar events
mainRouter.get('/events', async (c) => {
  try {
    const events = await getAvailableSlots();
    return c.json(events);
  } catch (error) {
    console.error('Error in /events:', error);
    return c.json({ error: 'An error occurred while fetching calendar events.' }, 500);
  }
});
 