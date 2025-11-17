import { fetchAPI } from "./config";

/**
 * Servicio de Estadísticas
 * Maneja todas las peticiones relacionadas con métricas y analíticas
 */
export const estadisticasService = {
  /**
   * Obtener estadísticas generales del dashboard
   * @param {string} periodo - hoy, ayer, semana, mes, trimestre, año
   */
  getEstadisticasGenerales: async (periodo = "hoy") => {
    return await fetchAPI(`/estadisticas/generales?periodo=${periodo}`);
  },

  /**
   * Obtener estadísticas detalladas de ventas
   * @param {Object} params - { periodo, fechaInicio, fechaFin }
   */
  getEstadisticasVentas: async (params = {}) => {
    const { periodo = "mes", fechaInicio, fechaFin } = params;

    let queryString = `periodo=${periodo}`;
    if (fechaInicio && fechaFin) {
      queryString = `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    }

    return await fetchAPI(`/estadisticas/ventas?${queryString}`);
  },

  /**
   * Obtener estadísticas de productos más vendidos
   * @param {Object} params - { periodo, limit }
   */
  getEstadisticasProductos: async (params = {}) => {
    const { periodo = "mes", limit = 10 } = params;
    return await fetchAPI(
      `/estadisticas/productos?periodo=${periodo}&limit=${limit}`
    );
  },

  /**
   * Obtener estadísticas de ocupación de mesas
   * @param {string} fecha - Fecha específica (YYYY-MM-DD) - default: hoy
   */
  getEstadisticasMesas: async (fecha = null) => {
    const queryString = fecha ? `?fecha=${fecha}` : "";
    return await fetchAPI(`/estadisticas/mesas${queryString}`);
  },

  /**
   * Obtener estadísticas de performance de empleados/meseros
   * @param {string} periodo - hoy, ayer, semana, mes, trimestre, año
   */
  getEstadisticasEmpleados: async (periodo = "mes") => {
    return await fetchAPI(`/estadisticas/empleados?periodo=${periodo}`);
  },

  /**
   * Obtener estadísticas de inventario y alertas de stock
   */
  getEstadisticasInventario: async () => {
    return await fetchAPI("/estadisticas/inventario");
  },

  /**
   * Obtener estadísticas de reservas
   * @param {string} periodo - hoy, ayer, semana, mes, trimestre, año
   */
  getEstadisticasReservas: async (periodo = "mes") => {
    return await fetchAPI(`/estadisticas/reservas?periodo=${periodo}`);
  },
};
