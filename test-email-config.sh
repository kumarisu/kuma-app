#!/bin/bash

echo "🧪 Testing Gmail SMTP Configuration"
echo "===================================="

# Check current .env settings
echo "📋 Current Email Configuration:"
echo "SMTP_USER: $(grep SMTP_USER .env | cut -d'=' -f2)"
echo "SMTP_HOST: $(grep SMTP_HOST .env | cut -d'=' -f2)"
echo "FROM_EMAIL: $(grep FROM_EMAIL .env | cut -d'=' -f2)"
echo "SEND_REAL_EMAILS: $(grep SEND_REAL_EMAILS .env | cut -d'=' -f2)"
echo ""

# Test sending OTP
TEST_EMAIL="daohuyhoa001@gmail.com"
echo "📧 Testing OTP send to: $TEST_EMAIL"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:1337/auth/send-otp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=$TEST_EMAIL")

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ OTP request sent successfully!"
    echo ""
    echo "📱 Check your email inbox and server logs"
    echo "🔍 If SEND_REAL_EMAILS=false, OTP will be in console"
    echo "🔍 If SEND_REAL_EMAILS=true, OTP will be sent to Gmail"
else
    echo "❌ Failed to send OTP"
    echo "🔧 Check your SMTP configuration and App Password"
fi

echo ""
echo "💡 To enable real email sending:"
echo "   1. Get Gmail App Password from: https://myaccount.google.com/apppasswords"
echo "   2. Update SMTP_PASS in .env with the 16-character password"
echo "   3. Set SEND_REAL_EMAILS=true in .env"
echo "   4. Restart server: npm run dev"
