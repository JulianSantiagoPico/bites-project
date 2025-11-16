import { fetchAPI } from "./config";

// Servicios de ubicaciones
export const ubicacionesService = {
  // Obtener ubicaciones del restaurante
  getUbicaciones: async () => {
    return await fetchAPI("/ubicaciones", {
      method: "GET",
    });
  },

  // Actualizar ubicaciones personalizadas
  updateUbicaciones: async (ubicacionesData) => {
    return await fetchAPI("/ubicaciones", {
      method: "PUT",
      body: JSON.stringify(ubicacionesData),
    });
  },
};

export default ubicacionesService;
