// backend/seeds/seedFooterContent.js
const mongoose = require("mongoose");
const TextContent = require("../models/TextContent");
require("dotenv").config();

const footerContents = [
  {
    key: "footer_text",
    title: "Texto sobre nosotros",
    content:
      "Decoración de globos personalizada para todo tipo de eventos. Transformamos tus celebraciones en momentos inolvidables.",
    section: "footer",
    order: 1,
    active: true,
  },
  {
    key: "footer_contact",
    title: "Información de contacto",
    content:
      "📧 info@auradeco.com\n📱 +54 11 1234-5678\n📍 Buenos Aires, Argentina",
    section: "footer",
    order: 2,
    active: true,
  },
  {
    key: "footer_hours",
    title: "Horarios de atención",
    content:
      "Lunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00\nDomingos: Cerrado",
    section: "footer",
    order: 3,
    active: true,
  },
];

const seedFooterContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    for (const content of footerContents) {
      const existing = await TextContent.findOne({ key: content.key });

      if (existing) {
        console.log(`⚠️  Ya existe: ${content.key}`);
      } else {
        await TextContent.create(content);
        console.log(`✅ Creado: ${content.key}`);
      }
    }

    console.log("\n✨ Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seedFooterContent();
