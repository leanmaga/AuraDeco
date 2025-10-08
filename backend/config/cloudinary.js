const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar storage para multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "globdeco-events", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [
      { width: 800, height: 800, crop: "limit" }, // Optimizar tamaño
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

module.exports = { cloudinary, storage };
