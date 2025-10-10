import { useState, useEffect } from "react";
import api from "../../services/api";

const BannerSettingsManager = () => {
  const [availableImages, setAvailableImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerConfig, setBannerConfig] = useState({
    globo1: "",
    puff1: "",
    deco1: "",
    globdeco: "",
    globo2: "",
    deco2: "",
    globo3: "",
  });

  const positions = [
    {
      key: "globo1",
      label: "📍 Columna 1 - Superior",
      description: "Primera imagen de la columna izquierda",
    },
    {
      key: "puff1",
      label: "📍 Columna 1 - Inferior",
      description: "Segunda imagen de la columna izquierda",
    },
    {
      key: "deco1",
      label: "📍 Columna 2 - Superior",
      description: "Primera imagen de la columna central",
    },
    {
      key: "globdeco",
      label: "🎥 Columna 2 - Centro (Video/Imagen principal)",
      description: "Video o imagen principal del centro",
    },
    {
      key: "globo2",
      label: "📍 Columna 2 - Inferior",
      description: "Tercera imagen de la columna central",
    },
    {
      key: "deco2",
      label: "📍 Columna 3 - Superior",
      description: "Primera imagen de la columna derecha",
    },
    {
      key: "globo3",
      label: "📍 Columna 3 - Inferior",
      description: "Segunda imagen de la columna derecha",
    },
  ];

  useEffect(() => {
    fetchImages();
    loadBannerConfig();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/site-images?active=true");
      setAvailableImages(response.data.images || []);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      alert("Error al cargar las imágenes disponibles");
    } finally {
      setLoading(false);
    }
  };

  const loadBannerConfig = async () => {
    try {
      const response = await api.get("/site-config/banner");
      if (response.data.success) {
        setBannerConfig(response.data.config);
      }
    } catch (error) {
      console.error("Error al cargar configuración:", error);
    }
  };

  const handleChange = (position, imageKey) => {
    setBannerConfig((prev) => ({
      ...prev,
      [position]: imageKey,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/site-config/banner", { bannerConfig });
      alert(
        "✅ Configuración guardada exitosamente!\n\nLos cambios son visibles para todos los usuarios."
      );
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const getImagePreview = (imageKey) => {
    const image = availableImages.find((img) => img.key === imageKey);
    return image?.url || null;
  };

  const isVideo = (url) => {
    return (
      url?.includes("/video/upload/") ||
      url?.endsWith(".mp4") ||
      url?.endsWith(".webm")
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎨 Configurador del Banner
        </h2>
        <p className="text-gray-600">
          Selecciona qué imágenes o videos mostrar en cada posición del banner
          principal
        </p>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Cómo funciona</h3>
            <p className="text-sm text-blue-800">
              Selecciona una imagen o video de tu biblioteca para cada posición
              del banner. Los cambios se guardan en el servidor y serán visibles
              para todos los usuarios.
            </p>
          </div>
        </div>
      </div>

      {/* Configuración de cada posición */}
      <div className="space-y-6 mb-8">
        {positions.map((position) => {
          const selectedImage = availableImages.find(
            (img) => img.key === bannerConfig[position.key]
          );
          const previewUrl = getImagePreview(bannerConfig[position.key]);

          return (
            <div
              key={position.key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-6">
                {/* Preview */}
                {previewUrl && (
                  <div className="w-40 h-32 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    {isVideo(previewUrl) ? (
                      <video
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {position.label}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {position.description}
                  </p>

                  {/* Dropdown */}
                  <select
                    value={bannerConfig[position.key] || ""}
                    onChange={(e) => handleChange(position.key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">-- Seleccionar imagen/video --</option>
                    {availableImages.map((image) => (
                      <option key={image._id} value={image.key}>
                        {image.key} - {image.description || "Sin descripción"}
                        {isVideo(image.url) ? " 🎥" : " 🖼️"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón guardar */}
      <div className="sticky bottom-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Guardar cambios</h3>
            <p className="text-sm text-gray-600">
              Los cambios serán visibles inmediatamente para todos los usuarios
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? "Guardando..." : "💾 Guardar Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerSettingsManager;
