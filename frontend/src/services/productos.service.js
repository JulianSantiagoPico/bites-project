import { fetchAPI } from "./config";

// Servicios de productos
export const productosService = {
  // Obtener todos los productos
  getProductos: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await fetchAPI(`/productos${queryString}`);
  },

  // Obtener un producto por ID
  getProductoById: async (id) => {
    return await fetchAPI(`/productos/${id}`);
  },

  // Crear nuevo producto
  createProducto: async (productoData) => {
    return await fetchAPI("/productos", {
      method: "POST",
      body: JSON.stringify(productoData),
    });
  },

  // Actualizar producto
  updateProducto: async (id, productoData) => {
    return await fetchAPI(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(productoData),
    });
  },

  // Desactivar producto (soft delete)
  deleteProducto: async (id) => {
    return await fetchAPI(`/productos/${id}`, {
      method: "DELETE",
    });
  },

  // Reactivar producto
  reactivarProducto: async (id) => {
    return await fetchAPI(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ activo: true }),
    });
  },

  // Cambiar disponibilidad
  toggleDisponibilidad: async (id, disponible) => {
    return await fetchAPI(`/productos/${id}/disponibilidad`, {
      method: "PATCH",
      body: JSON.stringify({ disponible }),
    });
  },

  // Obtener estadísticas de productos
  getEstadisticas: async () => {
    return await fetchAPI("/productos/estadisticas");
  },

  // Obtener productos destacados
  getProductosDestacados: async () => {
    return await fetchAPI("/productos/destacados");
  },
};
