import React from "react";
import ReactDOM from "react-dom/client";

import App from "./app/App";
import "./styles/globals.css";

// Handle client-side routing for page refreshes
// This ensures that if the app loads, we can handle the route properly
const handleClientSideRouting = () => {
  const path = window.location.pathname;
  const validRoutes = ['/', '/login', '/signup', '/dashboard', '/transfer', '/withdraw', '/deposit'];
  const isAuthRoute = path.startsWith('/auth/');
  
  // If it's a valid route or auth route, let React Router handle it
  if (validRoutes.includes(path) || isAuthRoute) {
    return;
  }
  
  // If we're on an invalid route but the app loaded, redirect to home
  // This handles cases where the server serves index.html but React Router doesn't match
  if (path !== '/') {
    window.history.replaceState({}, '', '/');
  }
};

// Run before React renders
handleClientSideRouting();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
