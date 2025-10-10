const siteConfigRoutes = require("./routes/siteConfig");
const textContentRoutes = require("./routes/textContent");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const app = express();

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://auradeco.vercel.app", // Frontend en producción
  "https://www.auradeco.vercel.app", // Con www por si acaso
].filter(Boolean);

console.log("🔧 CLIENT_URL desde .env:", process.env.CLIENT_URL);
console.log("🔧 Orígenes permitidos:", allowedOrigins);

// Configuración CORS más robusta
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔍 Origin recibido:", origin);

      // Permitir requests sin origin (Postman, curl, etc)
      if (!origin) {
        console.log("✅ Request sin origin permitido");
        return callback(null, true);
      }

      // Permitir cualquier subdominio de vercel.app
      if (origin.endsWith(".vercel.app")) {
        console.log("✅ Origin Vercel permitido:", origin);
        return callback(null, true);
      }

      // Verificar si está en la lista de orígenes permitidos
      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin en lista permitido:", origin);
        return callback(null, true);
      }

      // Si no coincide, rechazar
      console.log("❌ Origin rechazado:", origin);
      console.log("   Lista permitida:", allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} no permitido`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // Cache preflight por 10 minutos
  })
);

// Handler explícito para OPTIONS (preflight)
app.options("*", cors());

// ============================================
// MIDDLEWARES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging mejorado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `📨 [${timestamp}] ${req.method} ${req.path} - Origin: ${
      req.headers.origin || "sin origin"
    }`
  );
  next();
});

// ============================================
// RUTAS
// ============================================

// Rutas con prefijo /api
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/site-images", require("./routes/siteImages"));
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/text-content", textContentRoutes);

// Ruta de salud mejorada
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    cors: "enabled",
    allowedOrigins: allowedOrigins,
    clientUrl: process.env.CLIENT_URL,
    mongodb: "connected",
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "API de AuraDeco",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      upload: "/api/upload",
    },
    documentation: {
      postman: "https://documenter.getpostman.com/view/your-collection",
      swagger: "/api/docs",
    },
  });
});

// Ruta 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.path,
    method: req.method,
    availableEndpoints: [
      "/api/health",
      "/api/auth/login",
      "/api/categories",
      "/api/products",
      "/api/upload",
    ],
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Error capturado:", err.message);
  console.error("Stack:", err.stack);

  // Error de CORS
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "Error de CORS: Origen no permitido",
      error: err.message,
    });
  }

  // Error de validación
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: err.errors,
    });
  }

  // Error de autenticación
  if (err.name === "UnauthorizedError" || err.message.includes("token")) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
      error: err.message,
    });
  }

  // Error genérico
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log("🚀 SERVIDOR INICIADO EXITOSAMENTE");
      console.log("=".repeat(50));
      console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Puerto: ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/api/health`);
      console.log(`✅ CORS habilitado para:`, allowedOrigins);
      console.log(
        `🌍 Cliente configurado: ${process.env.CLIENT_URL || "No configurado"}`
      );
      console.log(`📤 Upload de imágenes: habilitado`);
      console.log(`📅 Fecha: ${new Date().toISOString()}`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    console.error("\n" + "=".repeat(50));
    console.error("❌ ERROR AL INICIAR SERVIDOR");
    console.error("=".repeat(50));
    console.error(`Mensaje: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error("=".repeat(50) + "\n");
    process.exit(1);
  }
};

// ============================================
// MANEJO DE EVENTOS DEL PROCESO
// ============================================

// Manejo de promesas rechazadas
process.on("unhandledRejection", (err) => {
  console.error("\n❌ ERROR NO MANEJADO (Unhandled Rejection)");
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  // Cerrar servidor y salir
  process.exit(1);
});

// Manejo de excepciones no capturadas
process.on("uncaughtException", (err) => {
  console.error("\n❌ EXCEPCIÓN NO CAPTURADA (Uncaught Exception)");
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  // Cerrar servidor y salir
  process.exit(1);
});

// Manejo de cierre graceful
process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM recibido. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT recibido. Cerrando servidor...");
  process.exit(0);
});

// ============================================
// INICIAR
// ============================================
startServer();
