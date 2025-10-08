require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/database");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar datos existentes
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("🗑️  Datos anteriores eliminados");

    // Crear categorías
    const categories = await Category.create([
      {
        name: "Globos",
        description: "Todo tipo de globos para tu evento",
        icon: "🎈",
        order: 1,
      },
      {
        name: "Mesas y Sillas",
        description: "Mesas y sillas para alquilar",
        icon: "🪑",
        order: 2,
      },
      {
        name: "Carteles LED",
        description: "Carteles de neón personalizados",
        icon: "💡",
        order: 3,
      },
      {
        name: "Candy Bar",
        description: "Mesas dulces y decoración",
        icon: "🍬",
        order: 4,
      },
      {
        name: "Decoración Extra",
        description: "Elementos decorativos adicionales",
        icon: "✨",
        order: 5,
      },
    ]);

    console.log("✅ Categorías creadas");

    // Crear productos de ejemplo
    const products = await Product.create([
      {
        name: "Arco de Globos Grande",
        description: "Arco de globos de 3 metros de ancho",
        price: 15000,
        category: categories[0]._id,
        images: [],
        order: 1,
      },
      {
        name: "Globos con Helio (x20)",
        description: "Pack de 20 globos inflados con helio",
        price: 8000,
        category: categories[0]._id,
        images: [],
        order: 2,
      },
      {
        name: "Mesa Rectangular",
        description: "Mesa rectangular de 2m x 80cm",
        price: 5000,
        category: categories[1]._id,
        stock: 10,
        order: 1,
      },
      {
        name: "Cartel LED Personalizado",
        description: "Cartel de neón LED con tu frase",
        price: 12000,
        category: categories[2]._id,
        order: 1,
      },
      {
        name: "Candy Bar Completo",
        description: "Mesa + manteles + dulceros + decoración",
        price: 18000,
        category: categories[3]._id,
        order: 1,
      },
    ]);

    console.log("✅ Productos creados");
    console.log("✨ Base de datos inicializada correctamente");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedData();
