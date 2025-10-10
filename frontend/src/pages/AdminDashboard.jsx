import { useState } from "react";
import CategoryManager from "../components/Admin/CategoryManager";
import ProductManager from "../components/Admin/ProductManager";
import SiteImageManager from "../components/Admin/SiteImageManager";
import BannerSettingsManager from "../components/Admin/BannerSettingsManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("categories");

  // Nota: Mantén las importaciones de useAuth y useNavigate de tu archivo original

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">
                AuraDeco Admin
              </h1>
              <span className="ml-4 text-sm text-gray-600">
                Bienvenido, {"{user?.username}"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Ver sitio →
              </a>
              <button
                onClick={() => {
                  /* handleLogout */
                }}
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
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("categories")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "categories"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              📁 Categorías
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "products"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🎈 Productos
            </button>
            <button
              onClick={() => setActiveTab("site-images")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "site-images"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🖼️ Imágenes del Sitio
            </button>
            <button
              onClick={() => setActiveTab("banner-settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === "banner-settings"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🎨 Configurar Banner
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "categories" && <CategoryManager />}
        {activeTab === "products" && <ProductManager />}
        {activeTab === "site-images" && <SiteImageManager />}
        {activeTab === "banner-settings" && <BannerSettingsManager />}
      </main>
    </div>
  );
};

export default AdminDashboard;
