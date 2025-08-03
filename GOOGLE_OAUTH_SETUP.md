# Google OAuth Setup Guide

This guide will help you set up Google OAuth for your School CRM application.

## Steps to Configure Google OAuth:

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure the project is selected in the top navigation

### 2. Enable Google APIs
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Add these to "Authorized JavaScript origins":
   - `http://localhost:3000` (for development)
   - Your production domain (when you deploy)
5. Add these to "Authorized redirect URIs":
   - `http://localhost:3000` (for development)
   - Your production domain (when you deploy)
6. Click "Create"

### 4. Configure Your Application
1. Copy the "Client ID" from the credentials you just created
2. Open the `.env` file in your project root
3. Replace `your-google-client-id-here` with your actual Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```
4. Save the file
5. Restart your development server (`npm start`)

### 5. Test the Integration
1. Navigate to the login page
2. You should now see the Google login button
3. Click it to test the Google OAuth flow

## Important Notes:
- Never commit your actual Client ID to version control if your repository is public
- For production, make sure to add your production domain to the authorized origins
- The Client ID should end with `.apps.googleusercontent.com`

## Troubleshooting:
- If you see "The given client ID is not found", check that you've correctly copied the Client ID
- If you see "403 Forbidden", make sure your domain is added to authorized origins
- Make sure to restart your development server after changing the `.env` file

## Alternative: Skip Google OAuth for Now
If you don't want to set up Google OAuth right now, you can continue using just the email/OTP login method. The application will show a message that Google login is not configured instead of breaking.
