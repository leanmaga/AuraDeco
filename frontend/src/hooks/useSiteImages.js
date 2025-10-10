import { useState, useEffect } from "react";
import api from "../services/api";

/**
 * Hook personalizado para obtener imágenes del sitio desde Cloudinary
 *
 * @param {string} section - Sección opcional para filtrar (banner, gallery, photocard, etc.)
 * @param {boolean} activeOnly - Si true, solo retorna imágenes activas
 * @returns {object} { images, loading, error, getImageByKey, refetch }
 */
const useSiteImages = (section = null, activeOnly = true) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = [];
      if (section) params.push(`section=${section}`);
      if (activeOnly) params.push(`active=true`);

      const queryString = params.length > 0 ? `?${params.join("&")}` : "";
      const response = await api.get(`/site-images${queryString}`);

      setImages(response.data.images || []);
    } catch (err) {
      console.error("Error al cargar imágenes del sitio:", err);
      setError(err.message || "Error al cargar las imágenes");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [section, activeOnly]);

  /**
   * Obtener una imagen por su key
   * @param {string} key - Key de la imagen
   * @returns {string|null} URL de la imagen o null si no existe
   */
  const getImageByKey = (key) => {
    const image = images.find((img) => img.key === key);
    return image?.url || null;
  };

  /**
   * Obtener múltiples imágenes por un array de keys
   * @param {string[]} keys - Array de keys
   * @returns {object} Objeto con las URLs de las imágenes
   */
  const getImagesByKeys = (keys) => {
    const result = {};
    keys.forEach((key) => {
      result[key] = getImageByKey(key);
    });
    return result;
  };

  /**
   * Obtener imágenes ordenadas (útil para galerías)
   * @returns {array} Array de imágenes ordenadas por el campo order
   */
  const getOrderedImages = () => {
    return [...images].sort((a, b) => a.order - b.order);
  };

  return {
    images,
    loading,
    error,
    getImageByKey,
    getImagesByKeys,
    getOrderedImages,
    refetch: fetchImages,
  };
};

export default useSiteImages;
