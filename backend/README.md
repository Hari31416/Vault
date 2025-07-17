# MyTools Backend

A Node.js/Express.js backend server for the MyTools MERN stack application with JWT authentication, user management, and MongoDB integration.

## Features

- **Authentication & Authorization**

  - JWT token-based authentication
  - User registration and login
  - Role-based access control (user, admin)
  - First user automatically becomes admin
  - Admin can create new users

- **Health Monitoring**

  - Basic health check endpoint
  - Detailed system health with database status, uptime, and memory usage

- **Security**
  - Password hashing with bcryptjs
  - Input validation
  - CORS configuration
  - Environment variables for sensitive data

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/my-tools
JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance (e.g., MongoDB Atlas).

## Running the Server

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Health Check

- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system information

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/create-user` - Create new user (admin only)

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── healthController.js  # Health check logic
├── middleware/
│   └── authMiddleware.js    # JWT authentication middleware
├── models/
│   └── User.js              # User model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── health.js            # Health check routes
├── .env                     # Environment variables
├── package.json
└── server.js                # Main server file
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable loader

## Development Dependencies

- **nodemon**: Development server with auto-restart
