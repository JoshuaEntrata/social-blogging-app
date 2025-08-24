// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking auth (you can add a spinner if you want)
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected content
  return children;
};

export default ProtectedRoute;
