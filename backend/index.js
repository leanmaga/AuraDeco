require("dotenv").config();
const connectDB = require("./config/database");
const app = require("./app");

// Vercel reutiliza instancias, connectDB maneja reconexiones
connectDB().catch((err) => {
  console.error("❌ Error conectando a MongoDB:", err);
});

module.exports = app;
