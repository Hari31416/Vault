# MyTools Backend

A Node.js/Express.js backend server built with TypeScript for the MyTools MERN stack application with JWT authentication, user management, and MongoDB integration.

## Features

- **TypeScript Implementation**

  - Full TypeScript support with strict type checking
  - Type-safe models, controllers, and middleware
  - Compiled output for production deployment

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
FRONTEND_URL=http://localhost:3000
```

3. Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance (e.g., MongoDB Atlas).

## Running the Server

### Development (with TypeScript)

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Available Scripts

- `npm run dev` - Start development server with TypeScript and hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server from compiled JavaScript
- `npm run clean` - Remove compiled output directory

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Health Check

- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system information

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /api/auth/users-exist` - Check if any users exist in database
- `POST /api/auth/create-user` - Create new user (admin only)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   └── healthController.ts  # Health check logic
│   ├── middleware/
│   │   └── authMiddleware.ts    # JWT authentication middleware
│   ├── models/
│   │   └── User.ts              # User model with TypeScript types
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   └── health.ts            # Health check routes
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── server.ts                # Main server file
├── dist/                        # Compiled JavaScript output
├── .env                         # Environment variables
├── tsconfig.json                # TypeScript configuration
├── package.json
└── .gitignore
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS configuration

## Dependencies

### Runtime Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT implementation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Development Dependencies

- **typescript**: TypeScript compiler
- **ts-node**: TypeScript execution for Node.js
- **nodemon**: Development server with auto-restart
- **@types/node**: Node.js type definitions
- **@types/express**: Express.js type definitions
- **@types/cors**: CORS type definitions
- **@types/bcryptjs**: bcryptjs type definitions
- **@types/jsonwebtoken**: jsonwebtoken type definitions
- **dotenv**: Environment variable loader

## Development Dependencies

- **nodemon**: Development server with auto-restart
