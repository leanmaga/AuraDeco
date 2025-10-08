const Category = require("../models/Category");

// @desc    Obtener todas las categorías activas
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// @desc    Obtener todas las categorías (incluye inactivas - admin)
// @route   GET /api/categories/all
// @access  Private/Admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 }).lean();

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Error al obtener todas las categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

// @desc    Crear nueva categoría
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    const category = await Category.create({
      name,
      description,
      icon,
      order,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

// @desc    Actualizar categoría
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

// @desc    Eliminar categoría
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar si hay productos asociados
    const Product = require("../models/Product");
    const productsCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar. Hay ${productsCount} producto(s) asociado(s) a esta categoría.`,
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Categoría eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};

module.exports = {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
