import { useAuth } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};

export default PrivateRoute;
