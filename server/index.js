import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email configuration from environment variables
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Recipient email - where you want to receive contact form submissions
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }

  // Email options
  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: RECIPIENT_EMAIL,
    subject: `[Portfolio Contact] New message from ${name}`,
    html: `
      <div style="font-family: 'Courier New', monospace; background: #0a0a0a; padding: 20px; color: #fff;">
        <h2 style="color: #00D23B; border-bottom: 1px dashed #333; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="margin: 20px 0;">
          <p style="color: #66FF00;">Identifier:</p>
          <p style="color: #fff; margin-left: 20px;">${name}</p>
        </div>
        <div style="margin: 20px 0;">
          <p style="color: #66FF00;">Contact Channel:</p>
          <p style="color: #fff; margin-left: 20px;">${email}</p>
        </div>
        <div style="margin: 20px 0;">
          <p style="color: #66FF00;">Message:</p>
          <p style="color: #fff; margin-left: 20px; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="border-top: 1px dashed #333; padding-top: 10px; margin-top: 20px;">
          <p style="color: #666; font-size: 12px;">
            Transmitted via Portfolio Contact Form
          </p>
        </div>
      </div>
    `,
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✓ Email sent successfully from ${name} (${email})`);
    res.json({ 
      success: true, 
      message: 'Message transmitted successfully' 
    });
  } catch (error) {
    console.error('✗ Email error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to transmit message. Please try again.' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Contact Form Server Running              ║
║   Port: ${PORT}                              ║
║   Endpoint: http://localhost:${PORT}/api/contact ║
╚════════════════════════════════════════════╝
  `);
});
