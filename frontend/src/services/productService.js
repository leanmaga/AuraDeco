import api from "./api";

const productService = {
  getProducts: async (categoryId = null) => {
    const url = categoryId ? `/products?category=${categoryId}` : "/products";
    const response = await api.get(url);
    return response.data;
  },

  getProductsByCategory: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    // Asegurar que los datos estén en el formato correcto
    const data = {
      name: productData.name,
      description: productData.description || "",
      price: parseFloat(productData.price),
      category: productData.category,
      stock: productData.stock ? parseInt(productData.stock) : null,
      featured: productData.featured || false,
      images: productData.images || [], // 👈 AGREGAR IMÁGENES
    };

    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const data = {
      name: productData.name,
      description: productData.description || "",
      price: parseFloat(productData.price),
      category: productData.category,
      stock: productData.stock ? parseInt(productData.stock) : null,
      featured: productData.featured || false,
      images: productData.images || [], // 👈 AGREGAR IMÁGENES
    };

    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
