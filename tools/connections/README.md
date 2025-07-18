# Connections Tracker Tool

A comprehensive tool for managing professional and personal connections, companies, and employment positions integrated into the MyTools application.

## Overview

The Connections Tracker tool allows users to:

- Manage personal and professional connections
- Track companies and their details
- Link connections to companies through positions
- Search across all data with real-time results
- View detailed profiles and employment histories

## Architecture

### Frontend Structure

```
frontend/src/tools/connections/
├── components/           # Reusable UI components
│   ├── ConnectionCard.tsx
│   ├── CompanyCard.tsx
│   ├── PositionCard.tsx
│   ├── ConnectionModal.tsx
│   ├── CompanyModal.tsx
│   ├── PositionModal.tsx
│   └── SearchBar.tsx
├── context/             # State management
│   └── ConnectionsContext.tsx
├── pages/               # Main page components
│   ├── ConnectionsDashboard.tsx
│   ├── ConnectionDetails.tsx
│   ├── CompanyDetails.tsx
│   └── PositionsPage.tsx
├── services/            # API communication
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── ConnectionsApp.tsx   # Main app component with routing
└── index.ts            # Export barrel
```

### Backend Structure

```
backend/src/tools/connections/
├── controllers/         # Request handlers
│   ├── connectionController.ts
│   ├── companyController.ts
│   └── positionController.ts
├── models/              # Database schemas
│   ├── Connection.ts
│   ├── Company.ts
│   └── Position.ts
└── routes/              # API routes
    ├── connections.ts
    ├── companies.ts
    ├── positions.ts
    └── index.ts
```

## Features

### 1. Connection Management

- **CRUD Operations**: Create, read, update, delete connections
- **Rich Profiles**: Store names, emails, phone numbers, LinkedIn/GitHub usernames
- **Personal Notes**: Add context and relationship details
- **Social Integration**: Direct links to social profiles

### 2. Company Management

- **Company Profiles**: Manage company information and industry classification
- **Website Integration**: Direct links to company websites
- **Industry Categorization**: Organize companies by business sectors

### 3. Position Tracking

- **Employment History**: Link connections to companies with specific roles
- **Timeline Management**: Track start dates, end dates, current positions
- **Role Details**: Store position titles and role-specific notes
- **Career Mapping**: Visualize professional relationships over time

### 4. Search & Discovery

- **Real-time Search**: Instant search with debounced input
- **Multi-field Search**: Search across names, emails, companies, notes
- **Smart Filtering**: Results organized by type
- **Interactive Results**: Click to navigate to detailed views

### 5. User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Components**: Clean Bootstrap-based interface
- **Interactive Cards**: Hover effects and smooth transitions
- **Modal Forms**: Streamlined data entry

## API Endpoints

### Connections

- `GET /api/connections` - Get all user connections
- `GET /api/connections/:id` - Get specific connection
- `POST /api/connections` - Create new connection
- `PUT /api/connections/:id` - Update connection
- `DELETE /api/connections/:id` - Delete connection
- `GET /api/connections/search?q=query` - Search connections

### Companies

- `GET /api/companies` - Get all user companies
- `GET /api/companies/:id` - Get specific company
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `GET /api/companies/search?q=query` - Search companies

### Positions

- `GET /api/positions` - Get all user positions
- `GET /api/positions/:id` - Get specific position
- `GET /api/positions/connection/:connectionId` - Get positions for connection
- `GET /api/positions/company/:companyId` - Get positions for company
- `POST /api/positions` - Create new position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

## Data Models

### Connection

```typescript
interface Connection {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  linkedinUsername?: string;
  githubUsername?: string;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Company

```typescript
interface Company {
  _id: string;
  name: string;
  industry?: string;
  website?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Position

```typescript
interface Position {
  _id: string;
  connectionId: string;
  companyId: string;
  title: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  notes?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage

### Accessing the Tool

1. Navigate to `/tools/connections` after logging in
2. The dashboard shows tabs for Connections and Companies
3. Use the search bar for real-time filtering
4. Click "Manage Positions" to access the positions interface

### Adding Data

1. **Connections**: Click "Add New Connection" and fill in the modal form
2. **Companies**: Switch to Companies tab and click "Add New Company"
3. **Positions**: Go to Positions page and click "Add New Position"

### Navigation

- Click "View" on cards to see detailed profiles
- Use breadcrumb navigation to move between sections
- Search results are clickable for quick navigation

## Integration

The tool is integrated into the main MyTools application:

- Uses existing authentication system
- Inherits theme settings (dark/light mode)
- Protected routes require user login
- Consistent UI with Bootstrap components

## Security

- All API endpoints require authentication
- Data is scoped to authenticated user
- Input validation on both frontend and backend
- SQL injection protection through Mongoose ODM
