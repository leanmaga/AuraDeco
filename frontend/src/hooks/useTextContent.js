// frontend/src/hooks/useTextContent.js
import { useState, useEffect } from "react";
import api from "../services/api";

// Hook para obtener un contenido específico por key
export const useTextContent = (key) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!key) return;

      try {
        setLoading(true);
        const response = await api.get(`/text-content/by-key/${key}`);
        setContent(response.data.content);
        setError(null);
      } catch (err) {
        // Solo loguear errores que NO sean 404
        if (err.response?.status !== 404) {
          console.error("Error al cargar contenido:", err);
        } else {
          // Para 404, simplemente establecer el contenido como null
          // El componente usará el valor por defecto
          console.debug(`Contenido no encontrado: ${key}`);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [key]);

  return { content, loading, error };
};

// Hook para obtener múltiples contenidos por sección
export const useTextContentSection = (section) => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      if (!section) return;

      try {
        setLoading(true);
        const response = await api.get(`/text-content/by-section/${section}`);
        setContents(response.data.contents);
        setError(null);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error al cargar contenidos:", err);
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [section]);

  return { contents, loading, error };
};
