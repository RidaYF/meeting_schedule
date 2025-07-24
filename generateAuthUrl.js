// generateAuthUrl.js
// This script helps you generate the Google OAuth authorization URL.

require('dotenv').config(); // Make sure dotenv loads your .env file
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  // --- UPDATED SCOPES: Added 'https://www.googleapis.com/auth/calendar.events' ---
  scope: [
    'https://www.googleapis.com/auth/calendar.events', // This scope allows creating/modifying events
    'https://www.googleapis.com/auth/calendar.readonly', // Keep this if you still need to read
    'https://www.googleapis.com/auth/userinfo.email'
  ],
  // -----------------------------------------------------------------------------
  prompt: 'consent' // Important for getting a refresh token, and for re-prompting consent
});

console.log('Visit this URL to authorize your app with updated permissions:', authUrl);
