/**
 * Script para migrar imágenes locales a Cloudinary
 *
 * USO:
 * 1. Coloca este archivo en: backend/scripts/migrateImages.js
 * 2. Ejecuta: node backend/scripts/migrateImages.js
 *
 * IMPORTANTE: Este script debe ejecutarse UNA SOLA VEZ para migrar las imágenes existentes
 */

const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Importar modelo
const SiteImage = require("../models/SiteImage");

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// CONFIGURACIÓN DE IMÁGENES A MIGRAR
// ============================================
// Modifica este array según tus necesidades
const imagesToMigrate = [
  // BANNER
  {
    localPath: "../../frontend/src/assets/globdeco.mp4",
    key: "banner_video",
    section: "banner",
    description: "Video principal del banner",
    order: 0,
    resourceType: "video", // 'image' o 'video'
  },

  // PHOTOCARD
  {
    localPath: "../../frontend/src/assets/arreglo.mp4",
    key: "photocard_video_arreglo",
    section: "photocard",
    description: "Video de arreglo para PhotoCard",
    order: 0,
    resourceType: "video",
  },
  {
    localPath: "../../frontend/src/assets/images/arreglo2.png",
    key: "photocard_arreglo2",
    section: "photocard",
    description: "Imagen secundaria 1 de PhotoCard",
    order: 1,
    resourceType: "image",
  },
  {
    localPath: "../../frontend/src/assets/images/arreglo3.png",
    key: "photocard_arreglo3",
    section: "photocard",
    description: "Imagen secundaria 2 de PhotoCard",
    order: 2,
    resourceType: "image",
  },

  // GALERÍA
  {
    localPath: "../../frontend/src/assets/images/5.png",
    key: "gallery_foto1",
    section: "gallery",
    description: "Decoración de Frozen",
    order: 1,
    resourceType: "image",
  },
  {
    localPath: "../../frontend/src/assets/images/4.png",
    key: "gallery_foto2",
    section: "gallery",
    description: "Arreglo de La Sirenita",
    order: 2,
    resourceType: "image",
  },
  {
    localPath: "../../frontend/src/assets/images/7.jpg",
    key: "gallery_foto3",
    section: "gallery",
    description: "Decoración para los 18",
    order: 3,
    resourceType: "image",
  },
  {
    localPath: "../../frontend/src/assets/images/6.png",
    key: "gallery_foto4",
    section: "gallery",
    description: "Decoración de Harry Potter",
    order: 4,
    resourceType: "image",
  },

  // BUYCARDS
  {
    localPath: "../../frontend/src/assets/images/1.png",
    key: "buycard_globo1",
    section: "buycard",
    description: "Globo personalizado 1",
    order: 1,
    resourceType: "image",
  },
  {
    localPath: "../../frontend/src/assets/images/2.png",
    key: "buycard_globo2",
    section: "buycard",
    description: "Globo personalizado 2",
    order: 2,
    resourceType: "image",
  },
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Subir un archivo a Cloudinary
 */
async function uploadToCloudinary(filePath, resourceType = "image") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "auradeco",
      resource_type: resourceType,
      transformation:
        resourceType === "image"
          ? [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" },
            ]
          : undefined,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`Error al subir ${filePath}:`, error);
    throw error;
  }
}

/**
 * Guardar imagen en la base de datos
 */
async function saveSiteImage(imageData) {
  try {
    // Verificar si ya existe
    const existing = await SiteImage.findOne({ key: imageData.key });

    if (existing) {
      console.log(
        `⚠️  La imagen "${imageData.key}" ya existe. Actualizando...`
      );

      // Eliminar imagen vieja de Cloudinary
      try {
        await cloudinary.uploader.destroy(existing.publicId);
      } catch (err) {
        console.warn("No se pudo eliminar imagen vieja:", err.message);
      }

      // Actualizar
      existing.url = imageData.url;
      existing.publicId = imageData.publicId;
      existing.section = imageData.section;
      existing.description = imageData.description;
      existing.order = imageData.order;

      await existing.save();
      return existing;
    }

    // Crear nueva
    const siteImage = await SiteImage.create(imageData);
    return siteImage;
  } catch (error) {
    console.error("Error al guardar en base de datos:", error);
    throw error;
  }
}

/**
 * Migrar una sola imagen
 */
async function migrateImage(imageConfig) {
  try {
    const { localPath, key, section, description, order, resourceType } =
      imageConfig;

    console.log(`\n📤 Migrando: ${key}`);
    console.log(`   Archivo: ${localPath}`);

    // Verificar que el archivo existe
    const fullPath = path.join(__dirname, localPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`   ❌ Archivo no encontrado: ${fullPath}`);
      return { success: false, key, error: "Archivo no encontrado" };
    }

    // Subir a Cloudinary
    console.log(`   ⬆️  Subiendo a Cloudinary...`);
    const { url, publicId } = await uploadToCloudinary(fullPath, resourceType);
    console.log(`   ✅ Subido: ${url}`);

    // Guardar en base de datos
    console.log(`   💾 Guardando en base de datos...`);
    await saveSiteImage({
      key,
      section,
      description,
      url,
      publicId,
      order,
      active: true,
    });
    console.log(`   ✅ Guardado en BD`);

    return { success: true, key, url };
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return { success: false, key: imageConfig.key, error: error.message };
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function migrateAll() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 INICIANDO MIGRACIÓN DE IMÁGENES A CLOUDINARY");
  console.log("=".repeat(50) + "\n");

  try {
    // Conectar a MongoDB
    console.log("📡 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    // Verificar configuración de Cloudinary
    console.log("☁️  Verificando Cloudinary...");
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Credenciales de Cloudinary no configuradas en .env");
    }
    console.log("✅ Cloudinary configurado\n");

    // Migrar cada imagen
    const results = [];
    for (const imageConfig of imagesToMigrate) {
      const result = await migrateImage(imageConfig);
      results.push(result);
    }

    // Mostrar resumen
    console.log("\n" + "=".repeat(50));
    console.log("📊 RESUMEN DE MIGRACIÓN");
    console.log("=".repeat(50));

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\n✅ Exitosas: ${successful}`);
    console.log(`❌ Fallidas: ${failed}`);
    console.log(`📊 Total: ${results.length}\n`);

    if (failed > 0) {
      console.log("❌ Imágenes fallidas:");
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   - ${r.key}: ${r.error}`);
        });
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 MIGRACIÓN COMPLETADA");
    console.log("=".repeat(50) + "\n");
  } catch (error) {
    console.error("\n❌ ERROR FATAL:", error);
    console.error(error.stack);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log("👋 Conexión cerrada\n");
    process.exit(0);
  }
}

// ============================================
// EJECUTAR
// ============================================

migrateAll();
