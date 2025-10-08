import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CategoryManager from "../components/Admin/CategoryManager";
import ProductManager from "../components/Admin/ProductManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">
                Glob.deco Admin
              </h1>
              <span className="ml-4 text-sm text-gray-600">
                Bienvenido, {user?.username}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/arma-tu-evento"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Ver sitio →
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "categories"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📁 Categorías
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📦 Productos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "categories" && <CategoryManager />}
        {activeTab === "products" && <ProductManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
