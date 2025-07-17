# MyTools - MERN Stack Multi-Tool Application

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides a collection of useful tools and utilities with user authentication and theme management.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)

- **JWT Authentication**: Secure user registration and login
- **Role-based Access Control**: User and admin roles
- **Auto Admin Assignment**: First registered user becomes admin
- **Health Monitoring**: System health checks and detailed status
- **User Management**: Admin can create users with role assignment
- **Security**: Password hashing, input validation, CORS protection

### Frontend (React + TypeScript)

- **Modern React**: Built with TypeScript for type safety
- **Theme System**: Light/dark mode with persistent selection
- **Responsive Design**: Mobile-first, accessible UI
- **Protected Routes**: Route-level authentication and authorization
- **Context API**: Global state management for auth and themes
- **Real-time Status**: Backend health monitoring display

## 🛠️ Tech Stack

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Frontend:**

- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- CSS custom properties for theming
- Context API for state management

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/my-tools
JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
PORT=5000
NODE_ENV=development
```

4. Start the backend server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend application:

```bash
npm start
```

## 🔧 Usage

1. **Start MongoDB**: Ensure MongoDB is running locally or update the connection string for MongoDB Atlas

2. **Start Backend**: Run the backend server first

   ```bash
   cd backend && npm run dev
   ```

3. **Start Frontend**: In a new terminal, start the React app

   ```bash
   cd frontend && npm start
   ```

4. **Access the Application**: Open [http://localhost:3000](http://localhost:3000)

5. **First User Setup**: Register the first user - they will automatically become an admin

## 📱 Application Features

### 🏠 Homepage

- Overview of available tools
- System health status display
- Responsive tool grid layout

### 🔐 Authentication

- User registration and login
- JWT token-based sessions
- Password validation and security

### 👤 User Dashboard

- Personal account overview
- Quick access to tools
- Account statistics

### ⚙️ Admin Panel

- Create new users with role assignment
- System monitoring and health checks
- User management capabilities

### 🎨 Theming

- Light and dark mode support
- Persistent theme selection
- Smooth transition animations

## 📁 Project Structure

```
my-tools/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── healthController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── health.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env
│   └── package.json
├── overview.md
└── README.md
```

## 🔗 API Endpoints

### Health Check

- `GET /api/health` - Basic server status
- `GET /api/health/detailed` - Detailed system information

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/create-user` - Create user (admin only)

## 🚦 Development Workflow

1. **Backend Development**: Start with API endpoints and database models
2. **Frontend Integration**: Build React components and connect to APIs
3. **Authentication Flow**: Implement login/register with JWT
4. **Protected Routes**: Add route guards and role-based access
5. **Theme System**: Implement light/dark mode switching
6. **Testing**: Test all features and API endpoints

## 🔒 Security Features

- Password hashing with bcryptjs (salt rounds: 12)
- JWT token expiration (7 days)
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Environment variables for sensitive data
- Protected routes with authentication middleware

## 🎯 Future Enhancements

- **Tools Implementation**: Add actual utility tools (calculator, text tools, etc.)
- **User Profiles**: Extended user profile management
- **Tool Favorites**: Save and organize favorite tools
- **Usage Analytics**: Track tool usage and statistics
- **Email Verification**: Add email verification for registration
- **Password Reset**: Implement forgot password functionality
- **File Upload**: Add file handling capabilities
- **API Rate Limiting**: Implement request rate limiting
- **Logging System**: Add comprehensive logging
- **Docker Support**: Containerize the application

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Issues & Support

If you encounter any issues or have questions, please [create an issue](https://github.com/yourusername/my-tools/issues) on GitHub.

---

**Built with ❤️ using the MERN stack**
