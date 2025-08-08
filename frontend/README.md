# Vault Frontend (React + TypeScript)

A React 18 + TypeScript frontend for the Vault MERN multi-tool application, providing authenticated access to modular productivity & tracking tool apps (ConnectVault, TasteVault), theme management, and a responsive UI.

## Features

- **Modern React with TypeScript**

  - Strict type safety
  - Functional components & hooks
  - Context API + custom hooks

- **Authentication & User Management**

  - JWT-based auth flow
  - Protected & role-gated routes (user / admin)
  - First registered user becomes admin (server logic)

- **Tool Apps (Modular Mounts)**

  - ConnectVault – connections, companies, positions
  - TasteVault – restaurants, dishes, ratings & analytics
  - Clean URL namespacing under `/tools/*`

- **Theme System**

  - Light & dark modes with persistence
  - CSS custom properties for easy theming
  - Smooth transitions & accessible contrast

- **Responsive Design**

  - Mobile-first layout
  - Modern Flexbox & CSS Grid
  - Accessible components

- **Status & UX**
  - Backend health status polling
  - Graceful loading & auth state handling

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

3. Make sure the backend server (Vault API) is running at the specified URL.

## Running the Application

### Development

```bash
npm start
```

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test
```

The application runs on <http://localhost:3000> by default.

## Tool App Overview

| Tool         | Namespace (Frontend) | API Base               | Summary                                       |
| ------------ | -------------------- | ---------------------- | --------------------------------------------- |
| ConnectVault | /tools/connections   | /api/tools/connections | Manage connections, companies, positions      |
| TasteVault   | /tools/savorscore    | /api/tools/savorscore  | Track restaurants, dishes, ratings, analytics |

## Project Structure (Frontend excerpt)

```text
frontend/
  src/
    tools/
      connections/   # ConnectVault UI
      savorscore/     # TasteVault UI
    context/          # Auth, Theme & shared contexts
    pages/            # Auth, Home, Admin, etc.
    components/       # Reusable UI
```

## Scripts

| Script | Description                       |
| ------ | --------------------------------- |
| start  | Run dev server (CRA)              |
| build  | Production bundle                 |
| test   | Run test suite                    |
| eject  | Eject CRA configuration (one-way) |

## Notes

- Ensure `REACT_APP_API_BASE_URL` matches backend port (default 5000).
- First user you register via UI becomes admin automatically.
- Tokens are stored client-side (consider hardening for production).

## Learn More

- React Docs: <https://react.dev>
- Create React App: <https://create-react-app.dev>

---

Built with ❤️ as part of the Vault MERN Stack Multi-Tool platform.
