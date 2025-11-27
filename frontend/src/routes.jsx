import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoListPage from "./pages/TodoListPage";
import TrashPage from "./pages/TrashPage";
import HolidayPage from "./pages/HolidayPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/layout/Layout";

// Define the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Default route - redirect to login page
      {
        index: true,
        element: <Navigate to="/login" replace />
      },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      // Protected routes (require authentication) - nested within App
      {
        path: "",
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { path: "todos", element: <TodoListPage /> },
          { path: "trash", element: <TrashPage /> },
          { path: "holidays", element: <HolidayPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

export default router;
