import { fetchAPI } from "./config";

// Servicios de categorías
export const categoriasService = {
  // Obtener categorías del restaurante
  getCategorias: async () => {
    return await fetchAPI("/categorias", {
      method: "GET",
    });
  },

  // Actualizar categorías personalizadas
  updateCategorias: async (categoriasData) => {
    return await fetchAPI("/categorias", {
      method: "PUT",
      body: JSON.stringify(categoriasData),
    });
  },
};

export default categoriasService;
