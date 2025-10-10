import { useState, useEffect } from "react";
import api from "../../services/api";

// Componente helper para detectar y renderizar imagen o video
const MediaPreview = ({ src, alt = "", className = "" }) => {
  if (!src) return null;

  const isVideo =
    src.includes("/video/upload/") ||
    src.endsWith(".mp4") ||
    src.endsWith(".webm") ||
    src.endsWith(".mov");

  if (isVideo) {
    return (
      <video src={src} className={className} controls muted playsInline>
        Tu navegador no soporta videos.
      </video>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

const SiteImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    key: "",
    section: "banner",
    description: "",
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isVideoFile, setIsVideoFile] = useState(false);

  const sections = [
    { value: "banner", label: "🎈 Banner Principal", color: "purple" },
    { value: "gallery", label: "🖼️ Galería", color: "pink" },
    { value: "photocard", label: "📸 PhotoCard", color: "blue" },
    { value: "buycard", label: "🛒 BuyCard", color: "green" },
    { value: "other", label: "📦 Otros", color: "gray" },
  ];

  useEffect(() => {
    fetchImages();
  }, [selectedSection]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params =
        selectedSection !== "all" ? `?section=${selectedSection}` : "";
      const response = await api.get(`/site-images${params}`);
      setImages(response.data.images || []);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      alert("Error al cargar las imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // Detectar si es video
      const isVideo = file.type.startsWith("video/");
      setIsVideoFile(isVideo);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.key || !uploadData.section) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("key", uploadData.key);
      formData.append("section", uploadData.section);
      formData.append("description", uploadData.description);
      formData.append("order", uploadData.order);

      await api.post("/site-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`${isVideoFile ? "Video" : "Imagen"} subida exitosamente`);
      setShowUploadModal(false);
      resetUploadForm();
      fetchImages();
    } catch (error) {
      console.error("Error al subir:", error);
      alert(error.response?.data?.message || "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadData({
      key: "",
      section: "banner",
      description: "",
      order: 0,
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsVideoFile(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este archivo?")) return;

    try {
      await api.delete(`/site-images/${id}`);
      alert("Archivo eliminado exitosamente");
      fetchImages();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el archivo");
    }
  };

  const toggleActive = async (id, currentActive) => {
    try {
      await api.put(`/site-images/${id}`, { active: !currentActive });
      fetchImages();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el estado");
    }
  };

  const getSectionColor = (section) => {
    const sectionData = sections.find((s) => s.value === section);
    return sectionData?.color || "gray";
  };

  const isVideo = (url) => {
    return (
      url?.includes("/video/upload/") ||
      url?.endsWith(".mp4") ||
      url?.endsWith(".webm") ||
      url?.endsWith(".mov")
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🖼️ Imágenes y Videos del Sitio
        </h2>
        <p className="text-gray-600">
          Gestiona todas las imágenes y videos que aparecen en tu sitio web
          desde Cloudinary
        </p>
      </div>

      {/* Filtros y botón nuevo */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedSection("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSection === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📊 Todas
          </button>
          {sections.map((section) => (
            <button
              key={section.value}
              onClick={() => setSelectedSection(section.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSection === section.value
                  ? `bg-${section.color}-600 text-white`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:scale-105 transition-transform"
        >
          ➕ Subir Archivo
        </button>
      </div>

      {/* Lista de archivos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando archivos...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-gray-600">No hay archivos en esta sección</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
          >
            Subir primer archivo →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            const itemIsVideo = isVideo(image.url);

            return (
              <div
                key={image._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Media */}
                <div className="relative h-48 bg-gray-100">
                  <MediaPreview
                    src={image.url}
                    alt={image.description || image.key}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge de tipo */}
                  {itemIsVideo && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      🎥 Video
                    </div>
                  )}

                  {!image.active && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        🚫 Desactivado
                      </span>
                    </div>
                  )}

                  <div
                    className={`absolute top-2 right-2 bg-${getSectionColor(
                      image.section
                    )}-600 text-white px-2 py-1 rounded text-xs font-medium`}
                  >
                    {sections
                      .find((s) => s.value === image.section)
                      ?.label.split(" ")[1] || image.section}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {image.key}
                    </code>
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {image.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Orden: {image.order}</span>
                    <span>
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(image._id, image.active)}
                      className={`flex-1 py-2 px-3 rounded font-medium text-sm transition-colors ${
                        image.active
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {image.active ? "🔴 Desactivar" : "✅ Activar"}
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="py-2 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium text-sm transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              📤 Subir {isVideoFile ? "Video" : "Imagen"}
            </h3>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4 rounded-lg overflow-hidden border-2 border-gray-200">
                {isVideoFile ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-48 object-cover"
                  >
                    Tu navegador no soporta videos.
                  </video>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key * (identificador único)
                </label>
                <input
                  type="text"
                  value={uploadData.key}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, key: e.target.value })
                  }
                  placeholder={
                    isVideoFile ? "ej: banner_video" : "ej: banner_globo1"
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sección *
                </label>
                <select
                  value={uploadData.section}
                  onChange={(e) =>
                    setUploadData({ ...uploadData, section: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {sections.map((section) => (
                    <option key={section.value} value={section.value}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={uploadData.description}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      description: e.target.value,
                    })
                  }
                  placeholder="¿Dónde se usa este archivo?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orden (para galerías)
                </label>
                <input
                  type="number"
                  value={uploadData.order}
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Archivo * (Imagen o Video)
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formatos: JPG, PNG, GIF, WebP, MP4, WebM, MOV (máx 10MB)
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform font-medium disabled:opacity-50 disabled:hover:scale-100"
              >
                {uploading ? "Subiendo..." : "Subir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteImageManager;
