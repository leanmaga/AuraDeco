import api from "./api";

const authService = {
  // Login
  login: async (username, password) => {
    try {
      console.log("🔐 Intentando login...");
      const response = await api.post("/auth/login", { username, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("✅ Login exitoso");
      }

      return response.data;
    } catch (error) {
      console.error(
        "❌ Error en login:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("👋 Sesión cerrada");
  },

  // Obtener usuario actual
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error al obtener usuario:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Obtener usuario del localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Registrar nuevo usuario (solo para superadmin)
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error al registrar usuario:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default authService;
