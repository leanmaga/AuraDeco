const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middleware/upload");
const { protect, isAdmin } = require("../middleware/auth");
const { cloudinary } = require("../config/cloudinary");

// @desc    Subir imagen individual
// @route   POST /api/upload
// @access  Private/Admin
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  handleMulterError,
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se proporcionó ninguna imagen" });
      }

      res.json({
        success: true,
        image: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      });
    } catch (error) {
      console.error("Error al subir imagen:", error);
      res.status(500).json({ message: "Error al subir imagen" });
    }
  }
);

// @desc    Eliminar imagen de Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete("/:publicId", protect, isAdmin, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);

    res.json({
      success: true,
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ message: "Error al eliminar imagen" });
  }
});

module.exports = router;
