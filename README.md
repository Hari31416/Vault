# Vault - MERN Stack Multi-Tool Application

A full-stack web application built with the MERN stack (MongoDB, Express.js, React, Node.js) that provides a collection of personal productivity & tracking utilities with user authentication, role-based access, and theme management.

## 🚀 Features

### Backend (Node.js + Express + MongoDB + TypeScript)

- **TypeScript Codebase**: Strong typing for safer backend development
- **JWT Authentication**: Secure user registration and login
- **Role-based Access Control**: User and admin roles
- **Auto Admin Assignment**: First registered user becomes admin
- **Health Monitoring**: Basic & detailed system health endpoints with retry-aware frontend handling
- **User Management**: Admin can create users with role assignment
- **Extensible Tool Architecture**: Namespaced tools mounted under `/api/tools/*`
- **Security**: Password hashing, input validation, CORS protection

### Frontend (React + TypeScript)

- **Modern React 18** with TypeScript
- **Theme System**: Light/dark mode with persistent selection
- **Responsive Design**: Mobile-first, accessible UI
- **Protected Routes**: Route-level authentication and authorization
- **Context API**: Global state management for auth, theming & per-tool state
- **Real-time Status**: Backend health monitoring display with retry logic
- **Modular Tool Apps**: Independent mini-apps (ConnectVault, TasteVault) under `/tools/*`

### Implemented Tool Apps

#### 1. ConnectVault (Connections Management)

Manage professional & personal network data.

- Connections with contact info, social links & notes
- Companies with metadata
- Positions associated with either a connection or a company
- Full CRUD with search endpoints
- Text indexes for searching across multiple fields
- Auth-protected routes per user

API Base: `/api/tools/connections`

- `GET /connections` – List connections
- `GET /connections/search?q=` – Search connections (text index)
- `GET /connections/:id` – Get single connection
- `POST /connections` – Create connection
- `PUT /connections/:id` – Update connection
- `DELETE /connections/:id` – Delete connection
- `GET /companies` / `GET /companies/search` / CRUD on companies
- `GET /positions` – List positions
- `GET /positions/connection/:connectionId` – Positions for a connection
- `GET /positions/company/:companyId` – Positions for a company
- CRUD routes for positions

#### 2. TasteVault (SavorScore) – Restaurant & Dining Ratings

Track restaurants, dishes & ratings with analytics.

API Base: `/api/tools/savorscore`

- `GET /restaurants` / `GET /restaurants/search` / CRUD
- `GET /dishes` / `GET /dishes/search` / CRUD
- `GET /dishes/restaurant/:restaurantId` – Dishes at a restaurant
- `GET /ratings` – List ratings
- `GET /ratings/analytics` – Aggregated analytics (averages, counts, etc.)
- `GET /ratings/restaurant/:restaurantId` – Ratings for a restaurant
- `GET /ratings/dish/:dishId` – Ratings for a dish
- CRUD routes for ratings

(All tool routes require authentication.)

## 🛠️ Tech Stack

**Backend:**

- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

**Frontend:**

- React 18 + TypeScript
- React Router
- Axios
- Context API / custom hooks
- CSS custom properties for theming

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)
- npm or yarn

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
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:

```bash
# Development mode (ts-node-dev / nodemon)
npm run dev

# Production build then run
npm run build && npm start
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

4. Start the frontend:

```bash
npm start
```

## 🔧 Usage Workflow

1. Start MongoDB (local daemon or Atlas connection)
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `cd frontend && npm start`
4. Access: http://localhost:3000
5. Register first user (auto-admin)
6. Begin using tool apps via the homepage buttons

## 📱 Application Areas

### Homepage

- Tool launcher cards (ConnectVault, TasteVault)
- Dynamic health status banner with retry feedback

### Authentication

- Registration & login
- JWT bearer token persisted client-side
- First user promoted to admin automatically

### Admin Panel

- Create additional users (assign role)
- Monitor system health

### ConnectVault

- CRUD for connections, companies, positions
- Search across text fields
- Relationship views (positions per connection/company)

### TasteVault

- CRUD for restaurants, dishes, ratings
- Analytics endpoint for summary insights
- Price range & cuisine tagging

### Theming

- Light/dark with persistent storage
- Accessible contrast & smooth transitions

## 📁 Project Structure (Simplified)

```
my-tools/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── tools/
│   │       ├── connections/
│   │       └── savorscore/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── tools/
│   │   │   ├── connections/
│   │   │   └── savorscore/
│   │   ├── pages/
│   │   ├── context/
│   │   └── components/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔗 Core API Endpoints

### Health

- `GET /api/health` – Basic status
- `GET /api/health/detailed` – Extended system info

### Authentication

- `POST /api/auth/register` – Register (auto-admin if first)
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Current user (auth)
- `GET /api/auth/users-exist` – Check if any users exist
- `POST /api/auth/create-user` – Admin create user

### Tools Overview

- `GET /` (root) – Returns JSON listing tool namespaces & endpoints

### ConnectVault (all require auth & start with `/api/tools/connections`)

See section above for detailed list.

### TasteVault (all require auth & start with `/api/tools/savorscore`)

See section above for detailed list.

## 🚦 Development Workflow

1. Add / adjust data models (TypeScript interfaces + Mongoose schemas)
2. Implement controllers & routes (namespaced under tools)
3. Extend frontend tool app with context, pages & services
4. Maintain auth & role checks in middleware
5. Add tests / manual verification (API + UI)
6. Optimize & refactor shared utilities

## 🔒 Security Practices

- Bcrypt password hashing (12 salt rounds default)
- JWT expiration (7 days)
- Route-level auth & admin middleware
- Input validation (server-side) & sanitization patterns
- CORS restricted to configured FRONTEND_URL
- Environment variables for secrets & config

## 📊 Data & Indexing

- Text indexes for connection search fields
- Compound indexes for performance (e.g., Restaurant: userId+name)
- Future: add indexes for analytics-heavy queries

## 🎯 Planned Enhancements

- Additional utility tool apps (productivity, finance, etc.)
- Favorites / quick launch
- Advanced analytics dashboards
- Email verification & password reset flows
- File & image upload support
- Rate limiting & improved logging
- Docker & CI pipeline
- Comprehensive test coverage

## 🧪 Testing (Suggested)

- API integration tests (Jest / Supertest)
- Component & hook tests (React Testing Library)
- E2E workflow tests (Playwright / Cypress)

## 📄 License

Open source under the MIT License.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes with clear messages
4. Test thoroughly
5. Open PR describing changes

## 🐛 Issues & Support

Open an issue on GitHub with reproduction steps.

---

Built with ❤️ using the MERN + TypeScript stack
