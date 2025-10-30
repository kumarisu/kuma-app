/**
 * AuthController
 *
 * @description :: Server-side actions for handling authentication
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {

  // GET /auth/login - Hiển thị trang đăng nhập
  showLogin: async (req, res) => {
    // Nếu user đã đăng nhập, redirect về home
    if (req.session.userId) {
      return res.redirect('/deck');
    }
    return res.view('pages/auth/login');
  },

  // POST /auth/send-otp - Gửi OTP qua email
  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.badRequest({ error: 'Email is required' });
      }

      // Generate 6-digit OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes

      console.log('📧 Generated OTP for', email, ':', otp);

      // Tìm hoặc tạo user
      let user = await User.findOne({ email });
      
      if (user) {
        // Update existing user with new OTP
        await User.updateOne({ id: user.id }).set({
          otp,
          otpExpiry
        });
        console.log('✅ Updated existing user with OTP');
      } else {
        // Create new user with OTP
        user = await User.create({
          email,
          otp,
          otpExpiry,
          isVerified: false
        }).fetch();
        console.log('✅ Created new user with OTP');
      }

      // Send OTP via email (for now, just log it)
      await sails.helpers.sendEmail.with({
        to: email,
        subject: 'Your OTP Code - Kuma App',
        text: `Your OTP code is: ${otp}\n\nThis code will expire in 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #118798;">🔐 Your OTP Code</h2>
            <p>Use this code to complete your login:</p>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #118798; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
            </div>
            <p><strong>This code will expire in 5 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      });

      if (req.wantsJSON) {
        return res.json({ 
          success: true, 
          message: 'OTP sent successfully',
          // For development, include OTP in response
          ...(process.env.NODE_ENV === 'development' && { otp })
        });
      }

      return res.view('pages/auth/verify-otp', { email });

    } catch (error) {
      console.error('❌ Error in AuthController.sendOTP:', error);
      return res.serverError(error);
    }
  },

  // POST /auth/verify-otp - Xác thực OTP
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.badRequest({ error: 'Email and OTP are required' });
      }

      console.log('🔍 Verifying OTP for', email, ':', otp);

      // Find user with matching email and valid OTP
      const user = await User.findOne({
        email,
        otp,
        otpExpiry: { '>': Date.now() }
      });

      if (!user) {
        console.log('❌ Invalid or expired OTP');
        
        if (req.wantsJSON) {
          return res.badRequest({ error: 'Invalid or expired OTP' });
        }
        
        return res.view('pages/auth/verify-otp', { 
          email, 
          error: 'Invalid or expired OTP. Please try again.' 
        });
      }

      // Clear OTP and mark as verified
      await User.updateOne({ id: user.id }).set({
        otp: '',
        otpExpiry: 0,
        isVerified: true,
        lastLoginAt: Date.now()
      });

      // Create session
      req.session.userId = user.id;
      req.session.userEmail = user.email;

      console.log('✅ User authenticated successfully:', user.email);

      if (req.wantsJSON) {
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '7d' }
        );
        
        return res.json({ 
          success: true, 
          message: 'Login successful',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isVerified: true
          },
          token
        });
      }

      return res.redirect('/deck');

    } catch (error) {
      console.error('❌ Error in AuthController.verifyOTP:', error);
      return res.serverError(error);
    }
  },

  // POST /auth/logout - Đăng xuất
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('❌ Error destroying session:', err);
        }
      });

      if (req.wantsJSON) {
        return res.json({ success: true, message: 'Logged out successfully' });
      }

      return res.redirect('/auth/login');
    } catch (error) {
      console.error('❌ Error in AuthController.logout:', error);
      return res.serverError(error);
    }
  },

  // GET /auth/me - Lấy thông tin user hiện tại
  me: async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.unauthorized({ error: 'Not authenticated' });
      }

      const user = await User.findOne({ id: req.session.userId });
      
      if (!user) {
        return res.unauthorized({ error: 'User not found' });
      }

      return res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        lastLoginAt: user.lastLoginAt
      });
    } catch (error) {
      console.error('❌ Error in AuthController.me:', error);
      return res.serverError(error);
    }
  }

};
