import { fetchAPI } from "./config";

// Servicios de reservas
export const reservasService = {
  // Obtener todas las reservas con filtros opcionales
  getReservas: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.fecha) params.append("fecha", filters.fecha);
    if (filters.estado) params.append("estado", filters.estado);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/reservas${queryString}`);
  },

  // Obtener una reserva por ID
  getReservaById: async (id) => {
    return await fetchAPI(`/reservas/${id}`);
  },

  // Crear nueva reserva
  createReserva: async (reservaData) => {
    return await fetchAPI("/reservas", {
      method: "POST",
      body: JSON.stringify(reservaData),
    });
  },

  // Actualizar reserva
  updateReserva: async (id, reservaData) => {
    return await fetchAPI(`/reservas/${id}`, {
      method: "PUT",
      body: JSON.stringify(reservaData),
    });
  },

  // Eliminar reserva (soft delete)
  deleteReserva: async (id) => {
    return await fetchAPI(`/reservas/${id}`, {
      method: "DELETE",
    });
  },

  // Cambiar estado de la reserva
  changeEstado: async (id, estado) => {
    return await fetchAPI(`/reservas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  // Asignar mesa a una reserva
  asignarMesa: async (id, mesaId) => {
    return await fetchAPI(`/reservas/${id}/asignar-mesa`, {
      method: "PATCH",
      body: JSON.stringify({ mesaId }),
    });
  },

  // Obtener estadísticas de reservas
  getEstadisticas: async () => {
    return await fetchAPI("/reservas/estadisticas");
  },
};
