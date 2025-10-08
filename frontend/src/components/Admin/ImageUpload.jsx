import { useState, useRef } from "react";
import uploadService from "../../services/uploadService";

const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    // Validar número máximo de imágenes
    if (images.length + files.length > maxImages) {
      setUploadError(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    // Validar tamaño de archivo (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter((file) => file.size > maxSize);

    if (invalidFiles.length > 0) {
      setUploadError("Algunas imágenes superan los 5MB");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Subir todas las imágenes
      const uploadPromises = files.map((file) =>
        uploadService.uploadImage(file)
      );
      const results = await Promise.all(uploadPromises);

      // Agregar las nuevas imágenes al array existente
      const newImages = results.map((result) => ({
        url: result.image.url,
        publicId: result.image.publicId,
      }));

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      setUploadError(
        error.response?.data?.message || "Error al subir las imágenes"
      );
    } finally {
      setUploading(false);
      // Resetear el input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];

    try {
      // Eliminar de Cloudinary
      if (imageToRemove.publicId) {
        await uploadService.deleteImage(imageToRemove.publicId);
      }

      // Eliminar del array
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      setUploadError("Error al eliminar la imagen");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes del Producto
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Máximo {maxImages} imágenes. Tamaño máximo: 5MB por imagen.
        </p>

        {/* Área de Upload */}
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`
              flex items-center justify-center gap-2 px-4 py-2 
              border-2 border-dashed border-gray-300 rounded-lg 
              cursor-pointer hover:border-purple-500 transition-colors
              ${
                uploading || images.length >= maxImages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-sm text-gray-600">Subiendo...</span>
              </>
            ) : (
              <>
                📤
                <span className="text-sm text-gray-600">
                  Seleccionar Imágenes ({images.length}/{maxImages})
                </span>
              </>
            )}
          </label>
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
            ⚠️ {uploadError}
          </div>
        )}
      </div>

      {/* Vista Previa de Imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              <img
                src={image.url}
                alt={`Producto ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay con botón eliminar */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  type="button"
                >
                  🗑️
                </button>
              </div>

              {/* Badge de número */}
              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje cuando no hay imágenes */}
      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-500">
            No hay imágenes cargadas. Hacé clic arriba para agregar.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
