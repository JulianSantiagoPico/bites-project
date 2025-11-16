import { fetchAPI } from "./config";

// Servicios de ocasiones
export const ocasionesService = {
  // Obtener ocasiones del restaurante
  getOcasiones: async () => {
    return await fetchAPI("/ocasiones", {
      method: "GET",
    });
  },

  // Actualizar ocasiones personalizadas
  updateOcasiones: async (ocasionesData) => {
    return await fetchAPI("/ocasiones", {
      method: "PUT",
      body: JSON.stringify(ocasionesData),
    });
  },
};

export default ocasionesService;
