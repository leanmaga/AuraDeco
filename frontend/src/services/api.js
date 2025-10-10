// frontend/src/services/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Solo loguear en desarrollo y no para contenido opcional
    if (import.meta.env.DEV && !config.url?.includes("text-content")) {
      console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    // Solo loguear en desarrollo y no para contenido opcional
    if (import.meta.env.DEV && !response.config.url?.includes("text-content")) {
      console.log("✅ Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Solo loguear errores que no sean 404 de text-content
    const isTextContentNotFound =
      url?.includes("text-content") && status === 404;

    if (!isTextContentNotFound) {
      console.error("❌ Response error:", {
        status,
        url,
        message: error.message,
      });
    }

    // Manejar errores de autenticación
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/admin")) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
