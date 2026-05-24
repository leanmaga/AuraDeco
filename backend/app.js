const siteConfigRoutes = require("./routes/siteConfig");
const textContentRoutes = require("./routes/textContent");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://auradeco.vercel.app",
  "https://www.auradeco.vercel.app",
].filter(Boolean);

console.log("🔧 CLIENT_URL desde .env:", process.env.CLIENT_URL);
console.log("🔧 Orígenes permitidos:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔍 Origin recibido:", origin);

      if (!origin) {
        console.log("✅ Request sin origin permitido");
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        console.log("✅ Origin Vercel permitido:", origin);
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin en lista permitido:", origin);
        return callback(null, true);
      }

      console.log("❌ Origin rechazado:", origin);
      console.log("   Lista permitida:", allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} no permitido`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
  })
);

app.options("*", cors());

// ============================================
// MIDDLEWARES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/site-images", require("./routes/siteImages"));
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/text-content", textContentRoutes);

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
  });
});

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

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: "Error de CORS: Origen no permitido",
      error: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      errors: err.errors,
    });
  }

  if (err.name === "UnauthorizedError" || err.message.includes("token")) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
      error: err.message,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Error interno del servidor",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
