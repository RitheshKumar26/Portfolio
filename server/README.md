# Contact Form Server Setup

## Configuration

Edit `server/index.js` and update these values with your credentials:

```javascript
// Email configuration - UPDATE THESE WITH YOUR CREDENTIALS
const EMAIL_CONFIG = {
  service: 'gmail', // or 'outlook', 'yahoo', etc.
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'      // Replace with your app password
  }
};

// Where to receive contact form submissions
const RECIPIENT_EMAIL = 'najmudeen.cs@gmail.com';
```

## Gmail App Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Under "Signing in to Google", click **App passwords**
4. Select "Mail" and your device, then click Generate
5. Copy the 16-character password and use it in `EMAIL_CONFIG.auth.pass`

## Running the Server

```bash
# Run just the email server
npm run server

# Run both frontend and server together
npm run dev:all

# Run frontend only (form won't send emails)
npm run dev
```

## API Endpoint

- **URL:** `http://localhost:3001/api/contact`
- **Method:** POST
- **Body:** `{ name, email, message }`

## Testing

Once the server is running, submit the contact form on your portfolio. Check the terminal for success/error logs.
