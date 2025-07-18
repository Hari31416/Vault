# Connections Tracker Web App

A comprehensive full-stack MERN application for efficiently managing and tracking your professional and personal connections, companies, and employment positions. This modern web application provides a centralized, secure platform for organizing your professional network with rich relationship mapping and career timeline tracking.

## ⚠️ Experimental Project Disclaimer

**This is an experimental project** - the result of an experiment to understand whether "vibe coding" can be used to generate end-to-end web applications.

**Important Notes:**

- The bulk of this code is AI-generated
- This code is **NOT optimized for production use**
- This project serves as a proof-of-concept and learning exercise
- Use at your own risk and review thoroughly before any production deployment

## 🚀 Technology Stack

**Frontend**: React (v19.1.0), Bootstrap CSS, React Context API, Bootstrap Icons  
**Backend**: Node.js, Express.js (v5.1.0), MongoDB, JWT Authentication, bcryptjs  
**Database**: MongoDB with Mongoose ODM (v8.15.0)  
**Development**: Create React App, nodemon, dotenv  
**Testing**: Jest, React Testing Library

## 🎨 Key Features

### 🔐 Authentication & Security

- **Multi-user System** - Secure JWT-based authentication with admin controls
- **First User Setup** - Automatic admin account creation for new installations
- **User Management** - Admin-only user registration and management
- **Data Isolation** - All user data is securely scoped and protected

### 👥 Advanced Connection Management

- **Rich Profiles** - Store names, emails, phone numbers, LinkedIn/GitHub usernames
- **Social Integration** - Direct links to LinkedIn and GitHub profiles
- **Personal Notes** - Add context and relationship details for each connection
- **Career History** - Comprehensive employment timeline across companies
- **CRUD Operations** - Full create, read, update, and delete functionality

### 🏢 Company Profiles & Organization

- **Company Database** - Manage detailed company information and industry categorization
- **Website Integration** - Direct links to company websites and resources
- **Employee Tracking** - View all connections associated with each company
- **Industry Classification** - Organize and filter companies by business sectors

### 💼 Position & Career Tracking

- **Employment History** - Link connections to companies with specific roles and dates
- **Timeline Management** - Track start dates, end dates, and current position indicators
- **Role Details** - Store position titles, employment periods, and role-specific notes
- **Relationship Mapping** - Visual representation of professional networks and career paths

### 🎨 Modern User Experience

- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Toggle between themes with persistent user preference
- **Interactive UI** - Clean Bootstrap-based interface with hover effects and smooth transitions
- **Modal Forms** - Streamlined data entry and editing experience
- **Real-time Updates** - Immediate synchronization across all components

### 🔍 Search & Discovery

- **Real-time Search** - Instant search across connections and companies with debounced input
- **Multi-field Search** - Search connections by name, email, phone, LinkedIn/GitHub usernames, and notes
- **Company Search** - Find companies by name, industry, and website
- **Search Filtering** - Filter results by type (All, Connections Only, Companies Only)
- **Interactive Results** - Click search results to navigate directly to detailed views
- **Smart Matching** - Case-insensitive partial matching for flexible search queries

### 🔍 Data Visualization & Navigation

- **Detail Views** - Comprehensive connection and company profile pages
- **Cross-References** - Easy navigation between related people, companies, and positions

## 🛠️ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Development Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd connections

   # Backend setup
   cd backend
   npm install
   # Create .env with: MONGODB_URI, JWT_SECRET, PORT=5000
   npm run dev

   # Frontend setup (in new terminal)
   cd ../frontend
   npm install
   # Create .env with: REACT_APP_API_BASE=http://localhost:5000/api
   npm start
   ```

2. **Access the application:**

   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/health`

3. **First-time setup:**
   - Navigate to the frontend URL
   - Create your first admin user account
   - Start adding connections, companies, and positions

## 🏗️ Project Architecture

```
connections/
├── backend/                 # Node.js/Express REST API
│   ├── src/
│   │   ├── index.js        # Main server file
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB/Mongoose data models
│   │   └── routes/         # API endpoint definitions
│   ├── package.json        # Backend dependencies
│   └── README.md          # Backend documentation
├── frontend/               # React application
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── components/    # Reusable UI components
│   │   └── context/       # State management & API services
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── README.md         # Frontend documentation
├── overview.md            # Detailed project specification
└── README.md             # This overview
```

## 📚 Comprehensive Documentation

### Component Documentation

- **[Backend API Documentation](https://github.com/Hari31416/connections_backend/blob/main/README.md)** - Complete REST API reference, database models, authentication system, security features, and Render deployment guide
- **[Frontend Application Documentation](https://github.com/Hari31416/connections_frontend/blob/main/README.md)** - React component architecture, state management, UI features, theming system, and Vercel deployment guide

### Project Resources

- **API Base URL**: Development - `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/health`

## 🚀 Production Deployment

### Recommended Stack

- **Frontend**: Vercel (optimized for React applications)
- **Backend**: Render (Node.js web services)
- **Database**: MongoDB Atlas (managed cloud database)

### Environment Configuration

Both components require environment variables for production deployment. See individual README files for complete configuration details:

- **Backend**: `MONGODB_URI`, `JWT_SECRET`, `PORT`
- **Frontend**: `REACT_APP_API_BASE`

### Deployment Steps

1. Deploy backend to Render with MongoDB Atlas
2. Deploy frontend to Vercel with backend API URL
3. Configure domain and SSL certificates
4. Set up monitoring and analytics

## 🧪 Development & Testing

- **Backend Testing**: API endpoint testing with comprehensive error handling
- **Frontend Testing**: Component testing with Jest and React Testing Library
- **Integration**: Full-stack testing with real database connections
- **Development Tools**: Hot reloading, request logging, and debug modes

## 🔧 Customization & Extension

The application is built with extensibility in mind:

- **API Endpoints**: RESTful design for easy integration
- **Component Architecture**: Modular React components for UI customization
- **Database Models**: Flexible MongoDB schemas for data extension
- **Authentication**: JWT-based system for third-party integrations
- **Theming**: CSS custom properties for visual customization

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Harikesh Kushwaha**
