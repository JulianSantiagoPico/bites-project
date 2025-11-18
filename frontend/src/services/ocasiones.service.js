import { fetchAPI } from "./config";

// Servicios de ocasiones
export const ocasionesService = {
  // Obtener ocasiones del restaurante
  getOcasiones: async () => {
    const response = await fetchAPI("/ocasiones", {
      method: "GET",
    });

    // Guardar en localStorage para uso en componentes
    if (response.data) {
      localStorage.setItem("customOcasiones", JSON.stringify(response.data));
    }

    return response;
  },

  // Actualizar ocasiones personalizadas
  updateOcasiones: async (ocasionesData) => {
    const response = await fetchAPI("/ocasiones", {
      method: "PUT",
      body: JSON.stringify(ocasionesData),
    });

    // Actualizar localStorage con la respuesta del servidor
    if (response.data) {
      localStorage.setItem("customOcasiones", JSON.stringify(response.data));
    }

    return response;
  },
};

export default ocasionesService;
