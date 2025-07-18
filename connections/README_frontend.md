# Connections Tracker - Frontend

A modern React application for managing professional and personal connections, companies, and employment positions. Features a responsive design, dark/light mode toggle, and intuitive user interface built with Bootstrap.

## ⚠️ Experimental Project Disclaimer

**This is an experimental project** - the result of an experiment to understand whether "vibe coding" can be used to generate end-to-end web applications.

**Important Notes:**

- The bulk of this code is AI-generated
- This code is **NOT optimized for production use**
- This project serves as a proof-of-concept and learning exercise
- Use at your own risk and review thoroughly before any production deployment

## 🚀 Technology Stack

- **Framework**: React (v19.1.0)
- **Styling**: Bootstrap CSS with custom themes
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom service layer
- **Icons**: Bootstrap Icons
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App (CRA)
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API server running (see [Backend README](https://github.com/Hari31416/connections_backend/blob/main/README.md))

## 🛠️ Installation & Setup

1. **Clone and navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the frontend root:

   ```env
   # Backend API Configuration
   REACT_APP_API_BASE=http://localhost:5000/api

   # Optional: For production deployment
   REACT_APP_API_BASE=https://your-backend-domain.com/api
   ```

4. **Start the development server**:

   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## 🎨 Key Features

### 🔐 Authentication System

- **First User Setup**: Automatic admin account creation for new installations
- **Secure Login**: JWT-based authentication with persistent sessions
- **User Management**: Admin-only user registration and management
- **Auto-logout**: Automatic session handling and cleanup

### 👥 Connection Management

- **CRUD Operations**: Create, read, update, and delete personal connections
- **Rich Profiles**: Store names, emails, phone numbers, LinkedIn/GitHub usernames
- **Notes System**: Add personal notes and context for each connection
- **Career History**: View employment history across companies
- **Social Integration**: Direct links to LinkedIn and GitHub profiles

### 🏢 Company Management

- **Company Profiles**: Manage company information and industry categorization
- **Website Integration**: Direct links to company websites
- **Employee Tracking**: View all connections associated with each company
- **Industry Classification**: Organize companies by industry sectors

### 💼 Position Tracking

- **Employment History**: Link connections to companies with specific roles
- **Date Tracking**: Start dates, end dates, and current position indicators
- **Job Details**: Position titles, employment periods, and role-specific notes
- **Career Timeline**: Visualize professional relationships over time

### 🔍 Search & Discovery

- **Real-time Search**: Instant search across connections and companies with debounced input
- **Multi-field Search**: Search connections by name, email, phone, LinkedIn/GitHub usernames, and notes
- **Company Search**: Find companies by name, industry, and website
- **Search Filtering**: Filter results by type (All, Connections Only, Companies Only)
- **Interactive Results**: Click search results to navigate directly to detailed views
- **Smart Matching**: Case-insensitive partial matching for flexible search queries

### 🎨 User Interface

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Modern Components**: Clean, intuitive interface with Bootstrap styling
- **Interactive Cards**: Hover effects and smooth transitions
- **Modal Forms**: Streamlined data entry and editing experience

## 🏗️ Application Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── Auth.js          # Login form
│   │   └── FirstUserSetup.js # Initial admin setup
│   ├── layout/              # Layout components
│   │   ├── Header.js        # Navigation header
│   │   ├── Footer.js        # Application footer
│   │   └── ServerLoading.js # Backend connectivity status
│   ├── lists/               # Data listing components
│   │   ├── ConnectionList.js # Connections overview
│   │   ├── CompanyList.js   # Companies overview
│   │   └── PositionList.js  # Positions overview
│   ├── modals/              # Modal dialog components
│   │   ├── ConnectionModal.js    # Connection form
│   │   ├── CompanyModal.js       # Company form
│   │   ├── PositionModal.js      # Position form
│   │   ├── UserManagementModal.js # User administration
│   │   └── ModalBackdrop.js      # Modal overlay
│   └── pages/               # Detail view components
│       ├── ConnectionDetails.js  # Connection profile page
│       └── CompanyDetails.js     # Company profile page
├── context/                 # State management
│   ├── AppContext.js        # Main application context
│   ├── authService.js       # Authentication API calls
│   ├── connectionService.js # Connection API calls
│   ├── companyService.js    # Company API calls
│   ├── positionService.js   # Position API calls
│   └── apiUtils.js          # HTTP utilities and health checks
├── App.js                   # Main application component
├── App.css                  # Global styles and themes
└── index.js                 # Application entry point
```

### State Management

The application uses React Context API for centralized state management:

- **AppContext**: Main application state including authentication, data, and UI preferences
- **Service Layer**: Abstracted API calls with error handling and token management
- **Local Storage**: Persistent JWT token storage and dark mode preference

### Data Flow

1. **Authentication**: JWT tokens stored in localStorage and included in API requests
2. **API Services**: Dedicated service files for each entity type (connections, companies, positions)
3. **State Updates**: Context providers update state based on API responses
4. **Component Updates**: Components re-render automatically when context state changes

## 📱 User Interface Components

### Navigation & Layout

- **Header**: Application title, user info, dark mode toggle, logout button
- **Footer**: Copyright and additional links
- **Responsive Grid**: Bootstrap-based responsive layout system

### Data Entry Forms

- **Modal Forms**: Overlay forms for creating and editing entities
- **Form Validation**: Client-side validation with error messaging
- **Cancel/Save Actions**: Clear user control over data modifications

### Data Display

- **Card Layouts**: Clean, organized display of entity information
- **Tables**: Sortable, responsive tables for list views
- **Detail Pages**: Comprehensive single-entity views with related data
- **Loading States**: Smooth loading indicators during API operations

### Interactive Elements

- **Buttons**: Consistent styling with hover effects and disabled states
- **Links**: Contextual navigation between related entities
- **Icons**: Bootstrap Icons for intuitive visual cues
- **Badges**: Status indicators and category labels

## 🔧 Configuration

### Environment Variables

```env
# Required: Backend API endpoint
REACT_APP_API_BASE=http://localhost:5000/api
```

### API Integration

The frontend communicates with the backend through a service layer that handles:

- **Authentication**: Automatic token inclusion in requests
- **Error Handling**: Consistent error processing and user feedback
- **Health Checks**: Backend connectivity monitoring
- **Request Logging**: Development-time request/response logging

## 📝 Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

### Development Commands

- `npm start`: Start development server (http://localhost:3000)
- `npm run build`: Create production build
- `npm test`: Run test suite
- `npm run eject`: Eject from Create React App (irreversible)

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**:

   ```bash
   npm run build
   vercel --prod
   ```

3. **Environment Variables in Vercel**:
   - Set `REACT_APP_API_BASE` to your production backend URL
   - Configure through Vercel dashboard or CLI

### Netlify Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy build folder**:

   - Drag and drop `build/` folder to Netlify
   - Or connect GitHub repository for automatic deploys

3. **Environment Variables**:
   - Configure `REACT_APP_API_BASE` in Netlify dashboard
   - Add build command: `npm run build`
   - Set publish directory: `build`

### Alternative Deployment Options

- **GitHub Pages**: Static hosting for React apps
- **Firebase Hosting**: Google's hosting platform
- **AWS S3 + CloudFront**: Scalable static hosting
- **Surge.sh**: Simple command-line deployment

## 🎨 Theming & Customization

### Dark/Light Mode

The application includes a built-in theme system:

- **Toggle Button**: Header-mounted theme switcher
- **Persistent Preference**: Theme choice saved to localStorage
- **CSS Variables**: Consistent color scheme across components
- **Bootstrap Integration**: Theme-aware Bootstrap classes

### Custom Styling

- **App.css**: Global styles and CSS custom properties
- **Bootstrap Classes**: Utility-first styling approach
- **Component Styles**: Scoped styles within components
- **Responsive Design**: Mobile-first responsive breakpoints

### Customization Options

```css
/* Custom CSS variables in App.css */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
}

.dark-mode {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --card-bg: #2d2d2d;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**:

   - Verify `REACT_APP_API_BASE` in `.env`
   - Ensure backend server is running
   - Check browser console for CORS errors

2. **Authentication Issues**:

   - Clear localStorage: `localStorage.clear()`
   - Verify JWT token format in backend logs
   - Check token expiration

3. **Build Errors**:

   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for missing environment variables
   - Verify all imports are correct

4. **Responsive Layout Issues**:
   - Test with browser dev tools
   - Verify Bootstrap CSS is loading
   - Check for conflicting custom styles

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Harikesh Kushwaha**

---

For backend API documentation, see [Backend README](https://github.com/Hari31416/connections_backend/blob/main/README.md).
