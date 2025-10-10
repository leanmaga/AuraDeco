const express = require("express");
const router = express.Router();
const SiteImage = require("../models/SiteImage");
const { protect, isAdmin } = require("../middleware/auth");
const { upload, handleMulterError } = require("../middleware/upload");
const { cloudinary } = require("../config/cloudinary");

// @desc    Obtener todas las imágenes del sitio (público)
// @route   GET /api/site-images
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { section, active } = req.query;

    const filter = {};
    if (section) filter.section = section;
    if (active !== undefined) filter.active = active === "true";

    const images = await SiteImage.find(filter).sort({ section: 1, order: 1 });

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las imágenes",
    });
  }
});

// @desc    Obtener imagen por key
// @route   GET /api/site-images/:key
// @access  Public
router.get("/:key", async (req, res) => {
  try {
    const image = await SiteImage.findOne({ key: req.params.key });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Imagen no encontrada",
      });
    }

    res.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la imagen",
    });
  }
});

// @desc    Crear/subir imagen del sitio
// @route   POST /api/site-images
// @access  Private/Admin
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      const { key, section, description, order } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No se proporcionó ninguna imagen",
        });
      }

      if (!key || !section) {
        // Si falla, eliminar imagen de Cloudinary
        await cloudinary.uploader.destroy(req.file.filename);
        return res.status(400).json({
          success: false,
          message: "Key y section son requeridos",
        });
      }

      // Verificar si ya existe una imagen con ese key
      const existingImage = await SiteImage.findOne({ key });
      if (existingImage) {
        // Eliminar imagen vieja de Cloudinary
        await cloudinary.uploader.destroy(existingImage.publicId);

        // Actualizar con nueva imagen
        existingImage.url = req.file.path;
        existingImage.publicId = req.file.filename;
        existingImage.section = section;
        existingImage.description = description;
        if (order !== undefined) existingImage.order = order;

        await existingImage.save();

        return res.json({
          success: true,
          image: existingImage,
          message: "Imagen actualizada correctamente",
        });
      }

      // Crear nueva imagen
      const image = await SiteImage.create({
        key,
        section,
        description,
        url: req.file.path,
        publicId: req.file.filename,
        order: order || 0,
      });

      res.status(201).json({
        success: true,
        image,
      });
    } catch (error) {
      console.error("Error al crear imagen:", error);

      // Intentar eliminar de Cloudinary si hubo error
      if (req.file) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cleanupError) {
          console.error("Error al limpiar imagen:", cleanupError);
        }
      }

      res.status(500).json({
        success: false,
        message: "Error al crear la imagen",
      });
    }
  }
);

// @desc    Actualizar imagen del sitio (sin cambiar archivo)
// @route   PUT /api/site-images/:id
// @access  Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const { description, order, active, section } = req.body;

    const image = await SiteImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Imagen no encontrada",
      });
    }

    // Actualizar campos
    if (description !== undefined) image.description = description;
    if (order !== undefined) image.order = order;
    if (active !== undefined) image.active = active;
    if (section !== undefined) image.section = section;

    await image.save();

    res.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la imagen",
    });
  }
});

// @desc    Eliminar imagen del sitio
// @route   DELETE /api/site-images/:id
// @access  Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const image = await SiteImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Imagen no encontrada",
      });
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Eliminar de base de datos
    await image.deleteOne();

    res.json({
      success: true,
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la imagen",
    });
  }
});

module.exports = router;
