import AdminLogin from "../components/Admin/AdminLogin";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
};

export default AdminPage;
