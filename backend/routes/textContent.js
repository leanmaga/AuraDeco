const express = require("express");
const router = express.Router();
const {
  getAllTextContents,
  getTextContentByKey,
  getTextContentsBySection,
  createTextContent,
  updateTextContent,
  toggleTextContentStatus,
  deleteTextContent,
} = require("../controllers/textContentController");
const { protect, isAdmin } = require("../middleware/auth");

// Rutas públicas (para frontend del sitio)
router.get("/", getAllTextContents);
router.get("/by-key/:key", getTextContentByKey);
router.get("/by-section/:section", getTextContentsBySection);

// Rutas privadas (solo admin)
router.post("/", protect, isAdmin, createTextContent);
router.put("/:id", protect, isAdmin, updateTextContent);
router.patch("/:id/toggle", protect, isAdmin, toggleTextContentStatus);
router.delete("/:id", protect, isAdmin, deleteTextContent);

module.exports = router;
