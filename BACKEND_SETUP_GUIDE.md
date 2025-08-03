# Backend Server Setup Guide

Your School CRM frontend is trying to connect to API endpoints that don't exist yet. Here's how to handle this:

## Current Status
- ✅ Frontend is working perfectly
- ❌ Backend API server is not running
- ✅ Development mode fallback is implemented

## API Endpoints Expected by Frontend

### Authentication Endpoints
1. `POST /api/auth/signup` - User registration
2. `POST /api/auth/login` - Send OTP to email
3. `POST /api/auth/verify-login` - Verify OTP and login
4. `POST /api/auth/google-login` - Google OAuth login

### Expected Request/Response Format

#### Signup Request
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123"
}
```

#### Login Request
```json
POST /api/auth/login
{
  "email": "john@example.com"
}
```

#### OTP Verification Request
```json
POST /api/auth/verify-login
{
  "email": "john@example.com",
  "otp": "123456"
}
```

## Current Development Mode Behavior

Since no backend is running, the frontend now handles this gracefully:

1. **Signup**: Shows success message and redirects to login
2. **Login**: Simulates OTP sending and allows user to proceed
3. **OTP Verification**: Simulates success and redirects to dashboard

## Options to Fix This

### Option 1: Use Development Mode (Current)
- Continue using the app as-is
- All forms work but don't actually save data
- Perfect for testing the UI and user experience

### Option 2: Create a Simple Backend
Create a basic Node.js/Express server with these endpoints:

```bash
# Install dependencies
npm install express cors body-parser jsonwebtoken bcryptjs nodemailer

# Create basic server structure
mkdir backend
cd backend
npm init -y
```

### Option 3: Use Mock API Service
Use services like:
- JSON Server
- MockAPI
- Postman Mock Server

### Option 4: Connect to Existing Backend
If you have a backend server, update the API URLs in:
- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`

## Quick Backend Setup (Express.js)

If you want to create a simple backend:

1. Create `backend/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Signup endpoint
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Signup:', { name, email });
  res.json({ message: 'User created successfully' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  console.log('Login request for:', email);
  res.json({ message: 'OTP sent to email' });
});

// OTP verification
app.post('/api/auth/verify-login', (req, res) => {
  const { email, otp } = req.body;
  console.log('OTP verification:', { email, otp });
  res.json({ 
    token: 'fake-jwt-token',
    user: { email, name: 'John Doe' }
  });
});

app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
```

2. Run the backend:
```bash
cd backend
node server.js
```

3. Update frontend API calls to use `http://localhost:5000` instead of relative URLs.

## For Now
Your app works perfectly in development mode! You can:
- Test the signup form (it will show success and redirect)
- Test the login form (it will simulate OTP and allow login)
- Access the dashboard and all features
- Test the Performance Analytics page we created

The 404 errors are expected and handled gracefully.
