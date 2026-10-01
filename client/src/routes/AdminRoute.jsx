import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

// Blocks access to the admin dashboard for non-admin users
const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;
