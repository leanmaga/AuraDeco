const TextContent = require("../models/TextContent");

// @desc    Obtener todos los contenidos textuales
// @route   GET /api/text-content
// @access  Public
const getAllTextContents = async (req, res) => {
  try {
    const { section, active } = req.query;

    const filter = {};
    if (section) filter.section = section;
    if (active !== undefined) filter.active = active === "true";

    const contents = await TextContent.find(filter)
      .sort({ section: 1, order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: contents.length,
      contents,
    });
  } catch (error) {
    console.error("Error al obtener contenidos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los contenidos",
      error: error.message,
    });
  }
};

// @desc    Obtener un contenido por key
// @route   GET /api/text-content/by-key/:key
// @access  Public
const getTextContentByKey = async (req, res) => {
  try {
    const content = await TextContent.findOne({
      key: req.params.key.toLowerCase(),
      active: true,
    }).lean();

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Contenido no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error al obtener contenido:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el contenido",
      error: error.message,
    });
  }
};

// @desc    Obtener contenidos por sección
// @route   GET /api/text-content/by-section/:section
// @access  Public
const getTextContentsBySection = async (req, res) => {
  try {
    const contents = await TextContent.find({
      section: req.params.section,
      active: true,
    })
      .sort({ order: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: contents.length,
      contents,
    });
  } catch (error) {
    console.error("Error al obtener contenidos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los contenidos",
      error: error.message,
    });
  }
};

// @desc    Crear nuevo contenido textual
// @route   POST /api/text-content
// @access  Private/Admin
const createTextContent = async (req, res) => {
  try {
    const { key, title, content, section, order, active } = req.body;

    // Validar campos requeridos
    if (!key || !title) {
      return res.status(400).json({
        success: false,
        message: "El key y el título son obligatorios",
      });
    }

    // Verificar si el key ya existe
    const existingContent = await TextContent.findOne({
      key: key.toLowerCase(),
    });
    if (existingContent) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un contenido con ese key",
      });
    }

    const newContent = await TextContent.create({
      key: key.toLowerCase(),
      title,
      content: content || "",
      section: section || "home",
      order: order || 0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: "Contenido creado exitosamente",
      content: newContent,
    });
  } catch (error) {
    console.error("Error al crear contenido:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un contenido con ese key",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear el contenido",
      error: error.message,
    });
  }
};

// @desc    Actualizar contenido textual
// @route   PUT /api/text-content/:id
// @access  Private/Admin
const updateTextContent = async (req, res) => {
  try {
    const { title, content, section, order, active } = req.body;

    const textContent = await TextContent.findById(req.params.id);

    if (!textContent) {
      return res.status(404).json({
        success: false,
        message: "Contenido no encontrado",
      });
    }

    // Actualizar campos (el key no se puede modificar)
    if (title !== undefined) textContent.title = title;
    if (content !== undefined) textContent.content = content;
    if (section !== undefined) textContent.section = section;
    if (order !== undefined) textContent.order = order;
    if (active !== undefined) textContent.active = active;

    await textContent.save();

    res.status(200).json({
      success: true,
      message: "Contenido actualizado exitosamente",
      content: textContent,
    });
  } catch (error) {
    console.error("Error al actualizar contenido:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el contenido",
      error: error.message,
    });
  }
};

// @desc    Alternar estado activo de un contenido
// @route   PATCH /api/text-content/:id/toggle
// @access  Private/Admin
const toggleTextContentStatus = async (req, res) => {
  try {
    const content = await TextContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Contenido no encontrado",
      });
    }

    content.active = !content.active;
    await content.save();

    res.status(200).json({
      success: true,
      message: `Contenido ${
        content.active ? "activado" : "desactivado"
      } exitosamente`,
      content,
    });
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado",
      error: error.message,
    });
  }
};

// @desc    Eliminar contenido textual
// @route   DELETE /api/text-content/:id
// @access  Private/Admin
const deleteTextContent = async (req, res) => {
  try {
    const content = await TextContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Contenido no encontrado",
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contenido eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar contenido:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el contenido",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTextContents,
  getTextContentByKey,
  getTextContentsBySection,
  createTextContent,
  updateTextContent,
  toggleTextContentStatus,
  deleteTextContent,
};
