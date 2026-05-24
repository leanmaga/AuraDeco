require("dotenv").config();
const connectDB = require("./config/database");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("\n" + "=".repeat(50));
      console.log("🚀 SERVIDOR INICIADO EXITOSAMENTE");
      console.log("=".repeat(50));
      console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Puerto: ${PORT}`);
      console.log(`🌐 API: http://localhost:${PORT}/api`);
      console.log(`💚 Health: http://localhost:${PORT}/api/health`);
      console.log(`📅 Fecha: ${new Date().toISOString()}`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    console.error("❌ ERROR AL INICIAR SERVIDOR:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("⚠️  SIGTERM recibido. Cerrando servidor...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("⚠️  SIGINT recibido. Cerrando servidor...");
  process.exit(0);
});

startServer();
