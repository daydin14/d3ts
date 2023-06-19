// Styling
import "./index.css";

// Dependencies
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Types
const createRoot = (ReactDOM as any).createRoot;

// Pages
import ErrorPage from "./pages/ErrorPage.tsx";

// Components
import App from "./App.tsx";
import Root from "./routes/Root.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
