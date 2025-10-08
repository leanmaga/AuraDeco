import api from "./api";

const uploadService = {
  // Subir imagen a Cloudinary
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      throw error;
    }
  },

  // Eliminar imagen de Cloudinary
  deleteImage: async (publicId) => {
    try {
      const response = await api.delete(`/upload/${publicId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      throw error;
    }
  },
};

export default uploadService;
