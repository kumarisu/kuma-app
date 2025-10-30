module.exports = {

  friendlyName: 'Send email',

  description: 'Send an email using nodemailer.',

  inputs: {
    to: {
      type: 'string',
      required: true,
      description: 'Email address of the recipient'
    },
    subject: {
      type: 'string',
      required: true,
      description: 'Subject line of the email'
    },
    text: {
      type: 'string',
      description: 'Plain text version of the email'
    },
    html: {
      type: 'string',
      description: 'HTML version of the email'
    }
  },

  fn: async function(inputs) {
    const nodemailer = require('nodemailer');

    // For development, use console logging only
    if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
      console.log('📧 [DEV MODE] Email would be sent:');
      console.log('To:', inputs.to);
      console.log('Subject:', inputs.subject);
      console.log('Text:', inputs.text);
      if (inputs.html) {
        // Extract OTP from HTML if possible
        const otpMatch = inputs.html.match(/<h1[^>]*>(\d{6})<\/h1>/);
        if (otpMatch) {
          console.log('🔐 OTP Code:', otpMatch[1]);
        }
      }
      console.log('---');
      return { messageId: 'dev-mode-' + Date.now() };
    }

    // Create transporter (configure based on your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@kuma-app.com',
      to: inputs.to,
      subject: inputs.subject,
      text: inputs.text,
      html: inputs.html
    });

    return { messageId: info.messageId };
  }

};
