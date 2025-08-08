# Vault Backend

A Node.js/Express.js backend server built with TypeScript for the Vault MERN stack multi‑tool application with JWT authentication, user management, and MongoDB integration.

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

1. Create a `.env` file with the following variables:

   ```env
   MONGODB_URI=mongodb://localhost:27017/my-tools
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

1. Make sure MongoDB is running locally or update the MONGODB_URI to point to your MongoDB instance (e.g., MongoDB Atlas).

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

## Authentication Usage

All protected endpoints require a JWT in the Authorization header:

```http
Authorization: Bearer <token>
```

Obtain the token via `POST /api/auth/login` or after registration.

Standard success response shape:

```json
{
  "success": true,
  "data": {}
}
```

Standard error response shape:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

## Core API Endpoints

### Health Endpoints

- `GET /api/health` - Basic health status
- `GET /api/health/detailed` - Detailed system information

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires authentication)
- `GET /api/auth/users-exist` - Check if any users exist in database
- `POST /api/auth/create-user` - Create new user (admin only)

## Tools Overview

Two feature modules are currently bundled under `/api/tools`:

1. ConnectVault (professional networking / job history helper)
2. TasteVault (restaurant, dish & rating tracker with analytics)

All tool routes are protected and require a valid JWT.

> NOTE: Route namespaces remain `/api/tools/connections` and `/api/tools/savorscore` for now; only product branding names changed to ConnectVault and TasteVault.

### 1. ConnectVault Module (Connections) (Base: `/api/tools/connections`)

Resource: Connections (`/connections`)

- `GET /api/tools/connections/connections` - List user's connections
- `GET /api/tools/connections/connections/search?q=term` - Full‑text search
- `GET /api/tools/connections/connections/:id` - Get a connection
- `POST /api/tools/connections/connections` - Create connection
- `PUT /api/tools/connections/connections/:id` - Update connection
- `DELETE /api/tools/connections/connections/:id` - Delete connection (also deletes its positions)

Resource: Companies (`/companies`)

- `GET /api/tools/connections/companies` - List companies
- `GET /api/tools/connections/companies/search?q=term` - Search companies (text index)
- `GET /api/tools/connections/companies/:id` - Get a company
- `POST /api/tools/connections/companies` - Create company
- `PUT /api/tools/connections/companies/:id` - Update company
- `DELETE /api/tools/connections/companies/:id` - Delete company (also deletes its positions)

Resource: Positions (`/positions`)

- `GET /api/tools/connections/positions` - List all positions
- `GET /api/tools/connections/positions/:id` - Get position by ID
- `GET /api/tools/connections/positions/connection/:connectionId` - Positions for a specific connection
- `GET /api/tools/connections/positions/company/:companyId` - Positions for a specific company
- `POST /api/tools/connections/positions` - Create position
- `PUT /api/tools/connections/positions/:id` - Update position
- `DELETE /api/tools/connections/positions/:id` - Delete position

### 2. TasteVault Module (SavorScore) (Base: `/api/tools/savorscore`)

Resource: Restaurants (`/restaurants`)

- `GET /api/tools/savorscore/restaurants` - List restaurants
- `GET /api/tools/savorscore/restaurants/search?q=term` - Search (name / cuisine / address)
- `GET /api/tools/savorscore/restaurants/:id` - Get restaurant
- `POST /api/tools/savorscore/restaurants` - Create restaurant
- `PUT /api/tools/savorscore/restaurants/:id` - Update restaurant
- `DELETE /api/tools/savorscore/restaurants/:id` - Delete restaurant

Resource: Dishes (`/dishes`)

- `GET /api/tools/savorscore/dishes` - List dishes (populated with restaurant name)
- `GET /api/tools/savorscore/dishes/search?q=term` - Search dishes (name / description / category)
- `GET /api/tools/savorscore/dishes/restaurant/:restaurantId` - Dishes for a restaurant
- `GET /api/tools/savorscore/dishes/:id` - Get dish
- `POST /api/tools/savorscore/dishes` - Create dish
- `PUT /api/tools/savorscore/dishes/:id` - Update dish
- `DELETE /api/tools/savorscore/dishes/:id` - Delete dish

Resource: Ratings (`/ratings`)

- `GET /api/tools/savorscore/ratings` - List ratings (populated)
- `GET /api/tools/savorscore/ratings/analytics` - Aggregated analytics (totals, averages, top & recent)
- `GET /api/tools/savorscore/ratings/restaurant/:restaurantId` - Ratings by restaurant
- `GET /api/tools/savorscore/ratings/dish/:dishId` - Ratings by dish
- `GET /api/tools/savorscore/ratings/:id` - Get rating
- `POST /api/tools/savorscore/ratings` - Create rating
- `PUT /api/tools/savorscore/ratings/:id` - Update rating
- `DELETE /api/tools/savorscore/ratings/:id` - Delete rating

## Project Structure

```text
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
│   ├── tools/
│   │   ├── connections/         # ConnectVault module (companies, connections, positions)
│   │   └── savorscore/          # TasteVault module (restaurants, dishes, ratings)
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

## Contributing

1. Fork & clone
2. Create feature branch
3. Run tests / lint (if added)
4. Open PR

## Future Enhancements

- Centralized validation layer (e.g. zod / Joi)
- Pagination & filtering helpers
- Rate limiting & logging middleware
- OpenAPI / Swagger documentation generation

## License

MIT
