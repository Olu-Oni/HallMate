import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const ProtectedRoute = () => {
  const { userLoggedIn } = useAuth(); // Get user authentication status

  return userLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
