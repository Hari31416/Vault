# MyTools Frontend

A React.js frontend application built with TypeScript for the MyTools MERN stack application, featuring theme management, authentication, and a modern UI.

## Features

- **Modern React with TypeScript**

  - Type-safe development
  - Functional components with hooks
  - Context API for state management

- **Authentication & User Management**

  - JWT token-based authentication
  - Protected routes
  - Role-based access control
  - User dashboard and admin panel

- **Theme System**

  - Light and dark theme support
  - Persistent theme selection
  - CSS custom properties for theming
  - Smooth theme transitions

- **Responsive Design**
  - Mobile-first approach
  - Modern CSS Grid and Flexbox
  - Accessible UI components

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the following variables:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

3. Make sure the backend server is running on the specified URL.

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

The application will start on port 3000.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
