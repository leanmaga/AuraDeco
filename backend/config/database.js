const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔄 Intentando conectar a MongoDB Atlas...");

    // Verificar que la URI existe
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI no está definida en las variables de entorno"
      );
    }

    // Mostrar info de conexión (ocultando credenciales)
    const uriPreview = process.env.MONGODB_URI.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://***:***@"
    );
    console.log(`📌 Conectando a: ${uriPreview}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // 30 segundos
      socketTimeoutMS: 45000, // 45 segundos
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    console.log(`📁 Base de datos: ${conn.connection.name}`);

    // Crear usuario admin por defecto si no existe
    const User = require("../models/User");
    const adminExists = await User.findOne({ username: "admin" });

    if (!adminExists) {
      await User.create({
        username: "admin",
        password: "admin123",
        role: "superadmin",
      });
      console.log("✅ Usuario admin creado: admin/admin123");
    } else {
      console.log("ℹ️  Usuario admin ya existe");
    }

    // Manejar eventos de conexión
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB desconectado");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Error de MongoDB:", err);
    });
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);

    // Mensajes de ayuda según el tipo de error
    if (error.message.includes("MONGODB_URI")) {
      console.error("💡 Verifica que tu archivo .env contenga MONGODB_URI");
    } else if (error.message.includes("IP")) {
      console.error(
        "💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas"
      );
      console.error("💡 Ve a: https://cloud.mongodb.com/v2/proyectos/network");
    } else if (error.message.includes("authentication")) {
      console.error("💡 Verifica tu usuario y contraseña de MongoDB");
    }

    throw error; // Re-lanzar el error para que startServer lo capture
  }
};

module.exports = connectDB;
