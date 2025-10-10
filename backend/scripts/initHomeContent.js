const mongoose = require("mongoose");
const TextContent = require("../models/TextContent");
require("dotenv").config();

// Datos iniciales del Home
const homeContents = [
  // Botón flotante
  {
    key: "home_btn_evento",
    title: "Texto Botón Armá tu Evento",
    content: "Armá tu Evento",
    section: "home",
    order: 1,
    active: true,
  },

  // PhotoCard
  {
    key: "home_photo_title",
    title: "Título PhotoCard",
    content: "Arreglo de globos personalizado",
    section: "home",
    order: 10,
    active: true,
  },
  {
    key: "home_photo_subtitle",
    title: "Subtítulo PhotoCard",
    content: "Miren la hermosa deco que realizamos para los 15 de Sofía💚🦋!",
    section: "home",
    order: 11,
    active: true,
  },
  {
    key: "home_photo_parrafo",
    title: "Descripción PhotoCard",
    content: "También realizamos centros de mesa y columnas",
    section: "home",
    order: 12,
    active: true,
  },

  // Galería - Evento 1 (Frozen)
  {
    key: "home_gallery1_title",
    title: "Galería 1 - Título",
    content: "Miren esta belleza de deco! De Frozen para los 3 añitos 🧊❄️",
    section: "home",
    order: 20,
    active: true,
  },
  {
    key: "home_gallery1_link",
    title: "Galería 1 - Link Instagram",
    content:
      "https://www.instagram.com/p/C0FwghyMLIT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    section: "home",
    order: 21,
    active: true,
  },

  // Galería - Evento 2 (La Sirenita)
  {
    key: "home_gallery2_title",
    title: "Galería 2 - Título",
    content: "Arreglo de La Sirenita!🧜🦀",
    section: "home",
    order: 22,
    active: true,
  },
  {
    key: "home_gallery2_link",
    title: "Galería 2 - Link Instagram",
    content:
      "https://www.instagram.com/p/CseRK0vL7NC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    section: "home",
    order: 23,
    active: true,
  },

  // Galería - Evento 3 (18 años)
  {
    key: "home_gallery3_title",
    title: "Galería 3 - Título",
    content: "Hermosa deco para los 18",
    section: "home",
    order: 24,
    active: true,
  },
  {
    key: "home_gallery3_link",
    title: "Galería 3 - Link Instagram",
    content:
      "https://www.instagram.com/p/C1zbN2qM9y-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    section: "home",
    order: 25,
    active: true,
  },

  // Galería - Evento 4 (Harry Potter)
  {
    key: "home_gallery4_title",
    title: "Galería 4 - Título",
    content:
      "Harry Potter Está deco superó nuestras expectativas, quedó divina!😍",
    section: "home",
    order: 26,
    active: true,
  },
  {
    key: "home_gallery4_link",
    title: "Galería 4 - Link Instagram",
    content:
      "https://www.instagram.com/p/C07rqJLMpl7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    section: "home",
    order: 27,
    active: true,
  },
];

/**
 * Inicializar contenidos del Home
 */
const initHomeContent = async () => {
  try {
    console.log("\n" + "=".repeat(60));
    console.log("📝 INICIALIZACIÓN DE CONTENIDOS DEL HOME");
    console.log("=".repeat(60) + "\n");

    // Conectar a MongoDB
    console.log("🔄 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB\n");

    let created = 0;
    let existing = 0;
    let errors = 0;

    // Crear cada contenido
    for (const content of homeContents) {
      try {
        const exists = await TextContent.findOne({ key: content.key });

        if (!exists) {
          await TextContent.create(content);
          console.log(
            `✅ Creado: ${content.key.padEnd(30)} | ${content.title}`
          );
          created++;
        } else {
          console.log(
            `⚠️  Ya existe: ${content.key.padEnd(30)} | ${content.title}`
          );
          existing++;
        }
      } catch (error) {
        console.error(`❌ Error con ${content.key}:`, error.message);
        errors++;
      }
    }

    // Resumen
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMEN DE LA INICIALIZACIÓN");
    console.log("=".repeat(60));
    console.log(`✅ Contenidos creados:    ${created}`);
    console.log(`⚠️  Contenidos existentes: ${existing}`);
    console.log(`❌ Errores:               ${errors}`);
    console.log(`📋 Total procesados:      ${homeContents.length}`);
    console.log("=".repeat(60) + "\n");

    if (errors === 0) {
      console.log("🎉 ¡Inicialización completada exitosamente!\n");
    } else {
      console.log("⚠️  Inicialización completada con errores\n");
    }

    // Cerrar conexión
    await mongoose.connection.close();
    console.log("👋 Conexión a MongoDB cerrada\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR FATAL:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Verificar que existe MONGODB_URI
if (!process.env.MONGODB_URI) {
  console.error(
    "❌ Error: MONGODB_URI no está definida en las variables de entorno"
  );
  console.error(
    "💡 Asegúrate de tener un archivo .env con MONGODB_URI configurada"
  );
  process.exit(1);
}

// Ejecutar
initHomeContent();
