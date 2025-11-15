import { fetchAPI } from "./config";

// Servicios de inventario
export const inventarioService = {
  // Obtener todo el inventario
  getInventario: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/inventario${queryString}`);
  },

  // Obtener un item por ID
  getItemById: async (id) => {
    return await fetchAPI(`/inventario/${id}`);
  },

  // Crear nuevo item
  createItem: async (itemData) => {
    return await fetchAPI("/inventario", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  // Actualizar item
  updateItem: async (id, itemData) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  },

  // Desactivar item (soft delete)
  deleteItem: async (id) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "DELETE",
    });
  },

  // Reactivar item
  reactivarItem: async (id) => {
    return await fetchAPI(`/inventario/${id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: true }),
    });
  },

  // Ajustar stock (entrada o salida)
  ajustarStock: async (id, ajusteData) => {
    return await fetchAPI(`/inventario/${id}/ajustar`, {
      method: "POST",
      body: JSON.stringify(ajusteData),
    });
  },

  // Obtener estadísticas del inventario
  getEstadisticas: async () => {
    return await fetchAPI("/inventario/estadisticas");
  },

  // Obtener alertas del inventario
  getAlertas: async () => {
    return await fetchAPI("/inventario/alertas");
  },
};
