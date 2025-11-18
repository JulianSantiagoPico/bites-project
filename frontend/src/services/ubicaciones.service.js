import { fetchAPI } from "./config";

// Servicios de ubicaciones
export const ubicacionesService = {
  // Obtener ubicaciones del restaurante
  getUbicaciones: async () => {
    const response = await fetchAPI("/ubicaciones", {
      method: "GET",
    });

    // Actualizar localStorage con las ubicaciones
    if (response.success && response.data) {
      // Asegurarse de que los datos sean objetos planos sin propiedades de Mongoose
      const cleanData = {
        ubicacionesDisplay: { ...response.data.ubicacionesDisplay },
        ubicacionesList: [...response.data.ubicacionesList],
        ubicacionesIcons: { ...response.data.ubicacionesIcons },
      };
      localStorage.setItem("customUbicaciones", JSON.stringify(cleanData));
    }

    return response;
  },

  // Obtener todas las ubicaciones (activas e inactivas)
  getTodasUbicaciones: async () => {
    return await fetchAPI("/ubicaciones/todas", {
      method: "GET",
    });
  },

  // Actualizar ubicaciones personalizadas
  updateUbicaciones: async (ubicacionesData) => {
    const response = await fetchAPI("/ubicaciones", {
      method: "PUT",
      body: JSON.stringify(ubicacionesData),
    });

    // Actualizar localStorage con las ubicaciones actualizadas
    if (response.success && response.data) {
      // Asegurarse de que los datos sean objetos planos sin propiedades de Mongoose
      const cleanData = {
        ubicacionesDisplay: { ...response.data.ubicacionesDisplay },
        ubicacionesList: [...response.data.ubicacionesList],
        ubicacionesIcons: { ...response.data.ubicacionesIcons },
      };
      localStorage.setItem("customUbicaciones", JSON.stringify(cleanData));
    }

    return response;
  },
};

export default ubicacionesService;
