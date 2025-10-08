import axios from "axios";

// IMPORTANTE: Debe incluir /api al final
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔗 API URL configurada:", API_URL); // Para debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 Request:", config.method.toUpperCase(), config.url); // Para debugging
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url); // Para debugging
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

export default api;
