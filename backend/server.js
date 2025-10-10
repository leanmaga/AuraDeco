// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();

    // Solo iniciar servidor si NO estamos en Vercel
    if (process.env.VERCEL !== "1") {
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
          `🌍 Cliente configurado: ${
            process.env.CLIENT_URL || "No configurado"
          }`
        );
        console.log(`📤 Upload de imágenes: habilitado`);
        console.log(`📅 Fecha: ${new Date().toISOString()}`);
        console.log("=".repeat(50) + "\n");
      });
    }
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

  // No hacer exit en Vercel
  if (process.env.VERCEL !== "1") {
    process.exit(1);
  }
});

// Manejo de excepciones no capturadas
process.on("uncaughtException", (err) => {
  console.error("\n❌ EXCEPCIÓN NO CAPTURADA (Uncaught Exception)");
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  // No hacer exit en Vercel
  if (process.env.VERCEL !== "1") {
    process.exit(1);
  }
});

// Manejo de cierre graceful (solo en desarrollo)
if (process.env.VERCEL !== "1") {
  process.on("SIGTERM", () => {
    console.log("\n⚠️  SIGTERM recibido. Cerrando servidor...");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("\n⚠️  SIGINT recibido. Cerrando servidor...");
    process.exit(0);
  });
}

// ============================================
// INICIAR
// ============================================
startServer();

// ============================================
// EXPORTAR PARA VERCEL
// ============================================
module.exports = app;
