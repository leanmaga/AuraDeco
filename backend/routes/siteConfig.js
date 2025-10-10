const express = require("express");
const router = express.Router();
const SiteConfig = require("../models/SiteConfig");
const { protect, isAdmin } = require("../middleware/auth");

// GET - Obtener configuración del banner (público)
router.get("/banner", async (req, res) => {
  try {
    let config = await SiteConfig.findOne({ key: "banner_config" });

    // Si no existe, crear configuración por defecto
    if (!config) {
      config = await SiteConfig.create({
        key: "banner_config",
        bannerConfig: {
          globo1: "banner_globo1",
          puff1: "banner_puff1",
          deco1: "banner_deco1",
          globdeco: "banner_video",
          globo2: "banner_globo2",
          deco2: "banner_deco2",
          globo3: "banner_globo3",
        },
      });
    }

    res.json({ success: true, config: config.bannerConfig });
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
});

// PUT - Actualizar configuración del banner (requiere autenticación)
router.put("/banner", protect, isAdmin, async (req, res) => {
  try {
    const { bannerConfig } = req.body;

    let config = await SiteConfig.findOne({ key: "banner_config" });

    if (!config) {
      config = await SiteConfig.create({
        key: "banner_config",
        bannerConfig,
      });
    } else {
      config.bannerConfig = bannerConfig;
      await config.save();
    }

    res.json({ success: true, config: config.bannerConfig });
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ message: "Error al actualizar configuración" });
  }
});

module.exports = router;
