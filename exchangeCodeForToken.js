    // exchangeCodeForToken.js
    // This script helps you exchange the authorization code for an access token and a refresh token.

    // Load environment variables from .env file
    require('dotenv').config();

    const { google } = require('googleapis');
    const readline = require('readline'); // Used to get input from the console

    // Create a readline interface to prompt for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    // Initialize OAuth2 client with credentials from .env
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Prompt the user to enter the authorization code
    rl.question('Enter the authorization code from the redirect URL: ', async (code) => {
      try {
        // Exchange the authorization code for tokens
        const { tokens } = await oAuth2Client.getToken(code);

        console.log('\n--- Successfully obtained tokens ---');
        console.log('Access Token:', tokens.access_token);
        console.log('Expiry Date:', new Date(tokens.expiry_date).toLocaleString());
        console.log('\n--- IMPORTANT: Your Refresh Token ---');
        console.log('Please copy this refresh token and add it to your .env file:');
        console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('-------------------------------------\n');

        // You might want to store tokens.refresh_token in your .env file now.
        // The access_token is short-lived, the refresh_token is long-lived.

      } catch (error) {
        console.error('Error exchanging code for tokens:', error.message);
        console.error('Make sure the authorization code is correct and has not expired.');
      } finally {
        // Close the readline interface
        rl.close();
      }
    });
    