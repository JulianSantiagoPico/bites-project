import { fetchAPI } from "./config";

// Servicios de categorías
export const categoriasService = {
  // Obtener categorías del restaurante
  getCategorias: async () => {
    const response = await fetchAPI("/categorias", {
      method: "GET",
    });

    // Guardar en localStorage para uso en utils (getCategoryIcon, getCategoryLabel)
    if (response.data) {
      localStorage.setItem("customCategorias", JSON.stringify(response.data));
    }

    return response;
  },

  // Actualizar categorías personalizadas
  updateCategorias: async (categoriasData) => {
    const response = await fetchAPI("/categorias", {
      method: "PUT",
      body: JSON.stringify(categoriasData),
    });

    // Actualizar localStorage con la respuesta del servidor
    if (response.data) {
      localStorage.setItem("customCategorias", JSON.stringify(response.data));
    }

    return response;
  },
};

export default categoriasService;
