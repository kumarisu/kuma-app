# Kuma App - Flashcard Learning Platform

A modern flashcard learning platform built with Sails.js and MongoDB, featuring OTP-based authentication and comprehensive deck management.

## 🚀 Features

### Authentication System
- **Email-based Registration/Login**: Users can sign up or log in using just their email address
- **OTP Verification**: Secure 6-digit OTP sent via email for verification
- **Automatic Account Creation**: New accounts are created automatically during first login
- **Session Management**: Secure session handling with JWT token support
- **Protected Routes**: Deck management routes are protected and require authentication

### Flashcard Management
- **Deck Creation**: Create and organize flashcard decks by topic or subject
- **Card Management**: Add, edit, and delete individual flashcards within decks
- **Search Functionality**: Quick search across all decks and cards
- **CRUD Operations**: Full Create, Read, Update, Delete operations for decks
- **Method Override Support**: HTML form support for PUT/DELETE operations

## 🏗️ Architecture

### Backend (Sails.js)
- **Models**: User, Deck with embedded Cards
- **Controllers**: AuthController, DeckController
- **Policies**: isAuthenticated policy for route protection
- **Helpers**: Email sending functionality
- **Database**: MongoDB with sails-mongo adapter

### Frontend
- **Modern UI**: Bootstrap 5 with custom styling
- **Responsive Design**: Mobile-friendly interface
- **Interactive Forms**: AJAX-powered authentication forms
- **Dashboard**: Clean deck management interface

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or remote)
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kuma-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_ADAPTER=sails-mongo
   DB_URL=mongodb://localhost:27017/kuma-app
   
   # Application Configuration
   PORT=1337
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Email Configuration (for production)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@kuma-app.com
   
   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Homepage: http://localhost:1337/
   - Login: http://localhost:1337/auth/login
   - Deck Management: http://localhost:1337/deck (requires authentication)

## 🔐 Authentication Flow

### Registration/Login Process
1. User visits `/auth/login`
2. User enters email address
3. System generates 6-digit OTP and sends via email
4. If user doesn't exist, creates new account automatically
5. User enters OTP on verification page
6. Upon successful verification:
   - Session is created
   - JWT token is generated
   - User is redirected to deck management

### Development Mode
In development mode, OTP codes are logged to the console instead of being sent via email:
```
📧 [DEV MODE] Email would be sent:
To: user@example.com
Subject: Your OTP Code - Kuma App
Text: Your OTP code is: 123456
🔐 OTP Code: 123456
```

## 📡 API Endpoints

### Authentication Routes
- `GET /auth/login` - Display login page
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP and login
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Deck Management Routes (Protected)
- `GET /deck` - List all decks
- `GET /deck/new` - New deck form
- `POST /deck` - Create new deck
- `GET /deck/:id` - View specific deck
- `GET /deck/:id/edit` - Edit deck form
- `PUT /deck/:id` - Update deck
- `DELETE /deck/:id` - Delete deck

### API Routes (Public)
- `GET /api/deck` - Get all decks (JSON)
- `POST /api/deck` - Create deck (JSON)
- `GET /api/deck/:id` - Get specific deck (JSON)
- `PUT /api/deck/:id` - Update deck (JSON)
- `DELETE /api/deck/:id` - Delete deck (JSON)

## 🧪 Testing

### Manual Testing Script
Run the included test script:
```bash
./test-auth-flow.sh
```

### Manual API Testing
```bash
# Send OTP
curl -X POST http://localhost:1337/auth/send-otp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com"

# Verify OTP (check console for OTP code)
curl -c cookies.txt -X POST http://localhost:1337/auth/verify-otp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&otp=123456"

# Access protected route
curl -b cookies.txt http://localhost:1337/deck

# Logout
curl -b cookies.txt -X POST http://localhost:1337/auth/logout
```

## 🛠️ Development

### Project Structure
```
kuma-app/
├── api/
│   ├── controllers/
│   │   ├── AuthController.js
│   │   └── DeckController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Deck.js
│   ├── policies/
│   │   └── isAuthenticated.js
│   └── helpers/
│       └── send-email.js
├── config/
│   ├── routes.js
│   ├── datastores.js
│   ├── session.js
│   └── http.js
├── views/
│   └── pages/
│       ├── homepage.ejs
│       ├── auth/
│       └── deck/
└── .env
```

### Adding New Features
1. Create models in `api/models/`
2. Create controllers in `api/controllers/`
3. Add routes in `config/routes.js`
4. Create views in `views/pages/`
5. Add policies for protection if needed

## 🚀 Deployment

### Production Configuration
1. Set `NODE_ENV=production` in `.env`
2. Configure real SMTP settings for email
3. Use strong JWT and session secrets
4. Set up MongoDB with proper authentication
5. Configure reverse proxy (nginx) if needed

### Environment Variables for Production
```env
NODE_ENV=production
DB_URL=mongodb://username:password@host:port/database
JWT_SECRET=very-long-random-string
SESSION_SECRET=another-very-long-random-string
SMTP_HOST=your-smtp-server.com
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed description

---

Built with ❤️ using Sails.js, MongoDB, and Bootstrap 5.
