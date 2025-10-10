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

  const loadBannerConfig = () => {
    // Cargar configuración guardada del localStorage
    const saved = localStorage.getItem("bannerConfig");
    if (saved) {
      setBannerConfig(JSON.parse(saved));
    }
  };

  const handleChange = (position, imageKey) => {
    setBannerConfig((prev) => ({
      ...prev,
      [position]: imageKey,
    }));
  };

  const handleSave = () => {
    setSaving(true);
    // Guardar en localStorage
    localStorage.setItem("bannerConfig", JSON.stringify(bannerConfig));

    setTimeout(() => {
      setSaving(false);
      alert(
        "✅ Configuración guardada exitosamente!\n\nRefresca la página principal para ver los cambios."
      );
    }, 500);
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
              del banner. Si no ves suficientes opciones, ve a "🖼️ Imágenes del
              Sitio" para subir más archivos.
            </p>
          </div>
        </div>
      </div>

      {/* Vista previa del layout */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">
          📐 Vista del Banner
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Columna 1 */}
          <div className="space-y-4">
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 1 - Superior
            </div>
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 1 - Inferior
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4">
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 2 - Superior
            </div>
            <div className="bg-purple-100 rounded border-2 border-purple-400 aspect-video flex items-center justify-center text-purple-700 text-xs font-semibold">
              🎥 VIDEO/IMAGEN PRINCIPAL
            </div>
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 2 - Inferior
            </div>
          </div>

          {/* Columna 3 */}
          <div className="space-y-4">
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 3 - Superior
            </div>
            <div className="bg-white rounded border-2 border-dashed border-gray-300 aspect-video flex items-center justify-center text-gray-400 text-xs">
              Columna 3 - Inferior
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de cada posición */}
      <div className="space-y-6">
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

                  {/* Info de selección */}
                  {selectedImage && (
                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Seleccionado:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {selectedImage.key}
                      </code>
                      {isVideo(selectedImage.url) && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          🎥 Video
                        </span>
                      )}
                      {selectedImage.section && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {selectedImage.section}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Preview */}
                <div className="w-48 h-32">
                  {previewUrl ? (
                    <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                      {isVideo(previewUrl) ? (
                        <video
                          src={previewUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt={position.label}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50">
                      <div className="text-center">
                        <div className="text-3xl mb-1">📷</div>
                        <div className="text-xs">Sin seleccionar</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 mt-8 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>

        <button
          onClick={() => window.open("/", "_blank")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          👁️ Ver Sitio
        </button>
      </div>

      {/* Advertencia */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="text-sm text-yellow-800">
            <strong>Importante:</strong> Después de guardar, debes refrescar la
            página principal del sitio para ver los cambios aplicados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSettingsManager;
