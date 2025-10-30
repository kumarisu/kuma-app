#!/bin/bash

# Demo script for Kuma App authentication flow
BASE_URL="http://localhost:1337"
EMAIL="demo@example.com"

echo "🚀 Testing Kuma App Authentication Flow"
echo "======================================="

# Test 1: Send OTP
echo "📧 Step 1: Sending OTP to $EMAIL..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/send-otp" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=$EMAIL")

echo "Response: $RESPONSE"

if echo "$RESPONSE" | grep -q "success"; then
    echo "✅ OTP sent successfully!"
    
    # Extract OTP from server logs (for development)
    echo "🔍 Please check server logs for OTP code"
    echo "💡 In development mode, OTP is logged to console"
    
    echo ""
    echo "📱 Step 2: Please manually verify OTP using:"
    echo "curl -c cookies.txt -X POST $BASE_URL/auth/verify-otp \\"
    echo "  -H 'Content-Type: application/x-www-form-urlencoded' \\"
    echo "  -d 'email=$EMAIL&otp=YOUR_OTP_HERE'"
    echo ""
    echo "🔒 Step 3: Test protected route access:"
    echo "curl -b cookies.txt $BASE_URL/deck"
    echo ""
    echo "🚪 Step 4: Test logout:"
    echo "curl -b cookies.txt -X POST $BASE_URL/auth/logout"
    
else
    echo "❌ Failed to send OTP"
    echo "Response: $RESPONSE"
fi

echo ""
echo "🌐 Open browser to test UI flow:"
echo "Homepage: $BASE_URL/"
echo "Login: $BASE_URL/auth/login"
echo "Decks: $BASE_URL/deck (requires authentication)"
