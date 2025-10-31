/**
 * Email configuration
 * (sails.config.email)
 */

// Load environment variables if not already loaded
if (!process.env.SMTP_HOST) {
  require('dotenv').config();
}

module.exports.email = {

  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'localhost',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },

  // Default from address
  from: process.env.FROM_EMAIL || 'noreply@kuma-app.com',

  // Development settings
  testMode: process.env.SEND_REAL_EMAILS !== 'true' && process.env.NODE_ENV !== 'production'

};
