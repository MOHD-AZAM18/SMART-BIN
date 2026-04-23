import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Wrong role
  if (role && user.role !== role) {
    return <h2 style={{ textAlign: "center" }}>🚫 Access Denied</h2>;
  }

  return children;
}