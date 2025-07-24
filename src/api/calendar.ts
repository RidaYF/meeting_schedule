import { google } from 'googleapis';
import type { CalendarEvent } from '../types/index.js';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Ensure refresh token is set before using oAuth2Client
// This assumes process.env.GOOGLE_REFRESH_TOKEN is loaded by dotenv
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
} else {
  console.error("GOOGLE_REFRESH_TOKEN is not set. Calendar API calls may fail.");
  // You might want to throw an error or handle this more gracefully in a production app
}

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

export async function getAvailableSlots(): Promise<CalendarEvent[]> {
  try {
    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10, // Get up to 10 upcoming events
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items ?? [];

    return events.map(event => ({
      summary: event.summary ?? 'No title',
      start: {
        dateTime: event.start?.dateTime ?? undefined,
        date: event.start?.date ?? undefined,
      },
      end: {
        dateTime: event.end?.dateTime ?? undefined,
        date: event.end?.date ?? undefined,
      },
    }));
  } catch (error: any) {
    console.error('Error fetching calendar events:', error.message);
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
}

// New function to schedule a meeting
export async function scheduleMeeting(eventDetails: {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  attendees?: { email: string }[];
}): Promise<any> {
  try {
    const event = {
      summary: eventDetails.summary,
      start: {
        dateTime: eventDetails.start.dateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use local timezone
      },
      end: {
        dateTime: eventDetails.end.dateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use local timezone
      },
      attendees: eventDetails.attendees || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 10 },    // 10 minutes before
        ],
      },
    };

    // --- FIX APPLIED HERE ---
    // The event body needs to be passed as 'requestBody'
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event, // Corrected: Use 'requestBody' instead of 'resource'
      sendNotifications: true, // Send email notifications to attendees
    });

    return res.data; // This will now be correctly typed and accessible
  } catch (error: any) {
    console.error('Error scheduling meeting:', error.message);
    throw new Error(`Failed to schedule meeting: ${error.message}`);
  }
}
