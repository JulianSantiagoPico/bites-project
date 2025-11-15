import { fetchAPI } from "./config";

// Servicios de pedidos
export const pedidosService = {
  // Obtener todos los pedidos
  getPedidos: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/pedidos${queryString}`);
  },

  // Obtener un pedido por ID
  getPedidoById: async (id) => {
    return await fetchAPI(`/pedidos/${id}`);
  },

  // Obtener pedidos de una mesa específica
  getPedidosByMesa: async (mesaId) => {
    return await fetchAPI(`/pedidos/mesa/${mesaId}`);
  },

  // Crear nuevo pedido
  createPedido: async (pedidoData) => {
    return await fetchAPI("/pedidos", {
      method: "POST",
      body: JSON.stringify(pedidoData),
    });
  },

  // Actualizar pedido (solo en estado pendiente)
  updatePedido: async (id, pedidoData) => {
    return await fetchAPI(`/pedidos/${id}`, {
      method: "PUT",
      body: JSON.stringify(pedidoData),
    });
  },

  // Cambiar estado del pedido
  changeEstado: async (id, estado) => {
    return await fetchAPI(`/pedidos/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  // Cancelar pedido
  cancelPedido: async (id) => {
    return await fetchAPI(`/pedidos/${id}`, {
      method: "DELETE",
    });
  },

  // Obtener estadísticas
  getEstadisticas: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/pedidos/estadisticas${queryString}`);
  },
};
