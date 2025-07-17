## MERN Stack Multi-Tool Application: Step-by-Step Overview

This guide outlines the key phases for developing your personal tools website with a MERN stack, including user management and theme options.

### 1. Project Setup

- **Initialize Project:** Create a root directory for your application.
- **Backend Setup:**
  - Inside the root, create a `backend` folder.
  - Initialize a Node.js project (`npm init -y`).
  - Install necessary dependencies: `express`, `mongoose`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `cors`.
- **Frontend Setup:**
  - Inside the root, create a `frontend` folder (e.g., using `npx create-react-app frontend`).
  - Install necessary dependencies: `axios`, `react-router-dom`.

---

### 2. Backend Development (Node.js & Express.js with MongoDB)

- **Database Connection:**
  - Set up a MongoDB database (e.g., MongoDB Atlas).
  - Configure your MongoDB connection URI in a `.env` file within your `backend` directory.
  - Write the connection logic in your main server file (`server.js`).
- **User Model:**
  - Define a Mongoose schema for `User` in `backend/models/User.js`. This schema will include `username`, `email`, `password`, and a `role` field (e.g., 'user', 'admin').
- **Authentication Routes & Controllers:**
  - **Health Routes:**
    - Create `healthController.js` with functions for `/health` (basic status) and `/health/detailed` (detailed status including database connection, uptime, memory).
    - Create `health.js` in `backend/routes` to define the GET routes for `/api/health` and `/api/health/detailed`, linking them to the controller functions.
  - **User Registration (`/register`):**
    - Implement `registerUser` in `authController.js`.
    - This function will handle creating a new user, **checking if it's the first user in the database and assigning 'admin' role if so**, otherwise assigning 'user'.
    - It will hash the password using `bcryptjs` and generate a JSON Web Token (JWT) using `jsonwebtoken`.
  - **User Login (`/login`):**
    - Implement `loginUser` in `authController.js`.
    - This function will verify credentials, compare passwords using `bcryptjs`, and generate a JWT on successful login.
  - **Admin User Creation (`/create-user` - Admin Only):**
    - Implement `createNewUser` in `authController.js`. This route will be secured by an authentication middleware to ensure only `admin` users can access it.
    - It will allow an admin to create new users and assign their roles.
  - **Authentication Middleware:**
    - Create `authMiddleware.js` in `backend/middleware`. This middleware will verify the JWT from incoming requests and attach the user's information (including role) to the request object.
  - **Auth Routes:**
    - Create `auth.js` in `backend/routes`.
    - Define POST routes for `/api/auth/register`, `/api/auth/login`, and `/api/auth/create-user`, linking them to the respective controller functions and applying the `authMiddleware` where necessary.
- **Main Server File (`server.js`):**
  - Configure `express` to use JSON body parsing and `cors`.
  - Import and use your health and authentication routes.
  - Start the server on a specified port.

---

### 3. Frontend Development (React)

- **Global Theme Management:**
  - Create a `ThemeContext.js` in `frontend/src/context` using React's Context API.
  - This context will manage the current theme state ('light' or 'dark').
  - It will include a `toggleTheme` function and store the preference in `localStorage`.
  - Modify `frontend/src/index.js` to wrap your `App` component with the `ThemeProvider`.
  - Define CSS variables for light and dark themes in `frontend/src/index.css` (or a dedicated stylesheet), using the `data-theme` attribute on the `html` or `body` tag.
- **Authentication Context:**
  - Create an `AuthContext.js` in `frontend/src/context`.
  - This context will manage the user's authentication state (logged in, user details, token).
  - It will provide `login`, `register`, `logout`, and `createUserByAdmin` functions that interact with your backend API using `axios`.
  - Wrap your `App` component with `AuthProvider` in `frontend/src/App.js` to make authentication state available globally.
- **Core Components:**
  - **Theme Toggle:** Create a simple `ThemeToggle` component (`frontend/src/components/ThemeToggle.js`) that uses the `ThemeContext` to switch themes.
  - **Navbar:** Design a `Navbar` component (`frontend/src/components/Navbar.js`) that dynamically displays links based on the user's authentication status and role (e.g., Login/Register vs. Dashboard/Admin Panel).
- **Pages:**
  - **Homepage (`frontend/src/pages/Home.js`):**
    - Display a list of your personal tools. Initially, this can be a static list of links.
    - Consider a section to display backend health status using calls to your `/api/health` routes.
  - **Registration Page (`frontend/src/pages/Register.js`):**
    - A form for users to register, interacting with your `/api/auth/register` endpoint.
  - **Login Page (`frontend/src/pages/Login.js`):**
    - A form for users to log in, interacting with your `/api/auth/login` endpoint.
  - **Dashboard (`frontend/src/pages/Dashboard.js`):**
    - A protected page accessible only to logged-in users, displaying user-specific information or tools. Implement client-side route protection.
  - **Admin Panel (`frontend/src/pages/AdminPanel.js`):**
    - A page accessible only to admin users, featuring a form to create new users (with role assignment) by calling your `/api/auth/create-user` endpoint. Implement strong client-side route protection.
- **Routing:**
  - Configure `react-router-dom` in `frontend/src/App.js` to define routes for your Home, Register, Login, Dashboard, and Admin Panel pages.

---

### 4. Running the Application

- **Start Backend:** Navigate to the `backend` directory and run `npm start` (or `node server.js`).
- **Start Frontend:** In a separate terminal, navigate to the `frontend` directory and run `npm start`.

This structured approach will help you build a robust foundation for your multi-tool application, ensuring common functionalities like authentication and theme management are reusable across all your personal tools.
