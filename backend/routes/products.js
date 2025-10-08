const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect, isAdmin } = require("../middleware/auth");

// Obtener todos los productos (público)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// Obtener productos por categoría (público)
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    })
      .populate("category", "name icon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos por categoría",
    });
  }
});

// Obtener producto por ID (público)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name icon"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

// Crear producto (admin) - CON IMÁGENES
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, images } =
      req.body;

    // Validación
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Nombre, precio y categoría son requeridos",
      });
    }

    // Validar que el precio sea un número válido
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser un número válido mayor a 0",
      });
    }

    // Crear producto CON IMÁGENES
    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || "",
      price: parsedPrice,
      category,
      stock: stock || null,
      featured: featured || false,
      images: images || [], // 👈 NUEVO: Guardar imágenes
      isActive: true,
    });

    // Poblar la categoría antes de devolver
    const populatedProduct = await Product.findById(product._id).populate(
      "category",
      "name icon"
    );

    res.status(201).json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    // Error de validación de Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    // Error de referencia (categoría no existe)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "La categoría seleccionada no es válida",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear el producto",
    });
  }
});

// Actualizar producto (admin) - CON IMÁGENES
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, featured, images } =
      req.body;

    const updateData = {
      name: name?.trim(),
      description: description?.trim(),
      price: parseFloat(price),
      category,
      stock: stock || null,
      featured: featured || false,
      images: images || [], // 👈 NUEVO: Actualizar imágenes
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name icon");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
    });
  }
});

// Eliminar producto (admin)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // TODO: Eliminar imágenes de Cloudinary si el producto las tiene
    // const cloudinary = require("../config/cloudinary").cloudinary;
    // if (product.images && product.images.length > 0) {
    //   for (const image of product.images) {
    //     await cloudinary.uploader.destroy(image.publicId);
    //   }
    // }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
    });
  }
});

module.exports = router;
