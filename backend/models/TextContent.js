const mongoose = require("mongoose");

const textContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "El key es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9_]+$/,
        "El key solo puede contener letras minúsculas, números y guiones bajos",
      ],
    },
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    section: {
      type: String,
      enum: ["home", "events", "about", "services", "testimonials", "footer"],
      default: "home",
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas más eficientes
textContentSchema.index({ section: 1, order: 1 });
textContentSchema.index({ active: 1 });

module.exports = mongoose.model("TextContent", textContentSchema);
