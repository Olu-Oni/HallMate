import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export const LogInRoute = () => {
  const { userLoggedIn } = useAuth(); // Get user authentication status

  return userLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoutes = ({ role }) => {
  if (!role) return null; // Wait until role is available
  return role === "admin" ? <Outlet /> : <Navigate to="/NotFound" replace />;
};

export const StudentRoutes = ({ role }) => {
  if (!role) return null; // Wait until role is available
  return role === "student" ? <Outlet /> : <Navigate to="/NotFound" replace />;
};


