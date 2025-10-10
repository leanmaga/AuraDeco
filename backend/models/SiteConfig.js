const mongoose = require("mongoose");

const siteConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "banner_config",
    },
    bannerConfig: {
      globo1: { type: String, default: "banner_globo1" },
      puff1: { type: String, default: "banner_puff1" },
      deco1: { type: String, default: "banner_deco1" },
      globdeco: { type: String, default: "banner_video" },
      globo2: { type: String, default: "banner_globo2" },
      deco2: { type: String, default: "banner_deco2" },
      globo3: { type: String, default: "banner_globo3" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
