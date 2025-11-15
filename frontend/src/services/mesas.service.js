import { fetchAPI } from "./config";

// Servicios de mesas
export const mesasService = {
  // Obtener todas las mesas
  getMesas: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/mesas${queryString}`);
  },

  // Obtener una mesa por ID
  getMesaById: async (id) => {
    return await fetchAPI(`/mesas/${id}`);
  },

  // Crear nueva mesa
  createMesa: async (mesaData) => {
    return await fetchAPI("/mesas", {
      method: "POST",
      body: JSON.stringify(mesaData),
    });
  },

  // Actualizar mesa
  updateMesa: async (id, mesaData) => {
    return await fetchAPI(`/mesas/${id}`, {
      method: "PUT",
      body: JSON.stringify(mesaData),
    });
  },

  // Eliminar mesa (soft delete)
  deleteMesa: async (id) => {
    return await fetchAPI(`/mesas/${id}`, {
      method: "DELETE",
    });
  },

  // Cambiar estado de la mesa
  changeEstado: async (id, estado) => {
    return await fetchAPI(`/mesas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  // Asignar mesero a una mesa
  asignarMesero: async (id, meseroId) => {
    return await fetchAPI(`/mesas/${id}/asignar`, {
      method: "PATCH",
      body: JSON.stringify({ meseroId }),
    });
  },

  // Obtener estadísticas de mesas
  getEstadisticas: async () => {
    return await fetchAPI("/mesas/estadisticas");
  },

  // Obtener mesas disponibles
  getMesasDisponibles: async (capacidadMinima = null) => {
    const params = capacidadMinima ? `?capacidadMinima=${capacidadMinima}` : "";
    return await fetchAPI(`/mesas/disponibles${params}`);
  },
};
