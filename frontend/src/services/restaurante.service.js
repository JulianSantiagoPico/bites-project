import { fetchAPI } from "./config";

// Servicios de restaurante
export const restauranteService = {
  // Obtener información del restaurante
  getRestaurante: async () => {
    return await fetchAPI("/restaurante");
  },

  // Obtener solo configuración del restaurante
  getConfiguracion: async () => {
    return await fetchAPI("/restaurante/configuracion");
  },

  // Actualizar información del restaurante
  updateRestaurante: async (restauranteData) => {
    return await fetchAPI("/restaurante", {
      method: "PUT",
      body: JSON.stringify(restauranteData),
    });
  },

  // Actualizar nombre del restaurante
  updateNombre: async (nombre) => {
    return await fetchAPI("/restaurante/nombre", {
      method: "PUT",
      body: JSON.stringify({ nombre }),
    });
  },

  // Actualizar horarios del restaurante
  updateHorarios: async (horarios) => {
    return await fetchAPI("/restaurante/horarios", {
      method: "PUT",
      body: JSON.stringify({ horarios }),
    });
  },

  // Actualizar información de contacto
  updateContacto: async (contactoData) => {
    return await fetchAPI("/restaurante/contacto", {
      method: "PUT",
      body: JSON.stringify(contactoData),
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
