const mongoose = require("mongoose");

const siteImageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // Claves como: 'banner_globo1', 'gallery_foto1', 'photocard_arreglo1'
    },
    section: {
      type: String,
      required: true,
      enum: ["banner", "gallery", "photocard", "buycard", "other"],
      // Organizar por secciones del sitio
    },
    description: {
      type: String,
      trim: true,
      // Descripción de dónde se usa esta imagen
    },
    url: {
      type: String,
      required: true,
      // URL de Cloudinary
    },
    publicId: {
      type: String,
      required: true,
      // ID público de Cloudinary para poder eliminar
    },
    order: {
      type: Number,
      default: 0,
      // Para ordenar imágenes en galerías
    },
    active: {
      type: Boolean,
      default: true,
      // Activar/desactivar sin eliminar
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas eficientes
siteImageSchema.index({ section: 1, order: 1 });
siteImageSchema.index({ key: 1 });

module.exports = mongoose.model("SiteImage", siteImageSchema);
