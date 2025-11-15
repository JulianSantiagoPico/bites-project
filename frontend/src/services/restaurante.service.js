import { fetchAPI } from "./config";

// Servicios de restaurante
export const restauranteService = {
  // Obtener información del restaurante
  getRestaurante: async () => {
    return await fetchAPI("/restaurante");
  },

  // Actualizar información del restaurante
  updateRestaurante: async (restauranteData) => {
    return await fetchAPI("/restaurante", {
      method: "PUT",
      body: JSON.stringify(restauranteData),
    });
  },

  // Completar configuración inicial
  completarConfiguracion: async (restauranteData) => {
    return await fetchAPI("/restaurante/completar-configuracion", {
      method: "POST",
      body: JSON.stringify(restauranteData),
    });
  },
};
