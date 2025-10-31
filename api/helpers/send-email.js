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

    // Debug: Check email config
    console.log('📧 [DEBUG] Email config:', {
      testMode: sails.config.email.testMode,
      smtp: {
        host: sails.config.email.smtp.host,
        port: sails.config.email.smtp.port,
        user: sails.config.email.smtp.auth.user
      },
      env: {
        NODE_ENV: process.env.NODE_ENV,
        SEND_REAL_EMAILS: process.env.SEND_REAL_EMAILS
      }
    });

    // Check if we should send real emails using Sails config
    const testMode = sails.config.email.testMode;
    
    // For development, use console logging unless explicitly enabled
    if (testMode) {
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

    // Validate SMTP configuration
    const smtpConfig = sails.config.email.smtp;
    console.log('📧 [REAL EMAIL] SMTP Config:', {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      passLength: smtpConfig.auth.pass ? smtpConfig.auth.pass.length : 0
    });
    
    if (!smtpConfig.host || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      throw new Error('SMTP configuration is incomplete. Please check SMTP_HOST, SMTP_USER, and SMTP_PASS in .env file.');
    }

    console.log('📧 [REAL EMAIL] Sending email to:', inputs.to);

    // Create transporter using Sails config
    const transporter = nodemailer.createTransport(smtpConfig);

    // Send email
    const info = await transporter.sendMail({
      from: sails.config.email.from,
      to: inputs.to,
      subject: inputs.subject,
      text: inputs.text,
      html: inputs.html
    });
    
    console.log('📧 ✅ Email sent successfully! Message ID:', info.messageId);
    return { messageId: info.messageId };
  }

};
