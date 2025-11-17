import { useState, useCallback } from "react";
import { estadisticasService } from "../services";

/**
 * Hook personalizado para manejar estadísticas
 * Proporciona métodos para obtener diferentes tipos de métricas
 */
export const useEstadisticas = () => {
  // Estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Datos de estadísticas
  const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
  const [estadisticasVentas, setEstadisticasVentas] = useState(null);
  const [estadisticasProductos, setEstadisticasProductos] = useState(null);
  const [estadisticasMesas, setEstadisticasMesas] = useState(null);
  const [estadisticasEmpleados, setEstadisticasEmpleados] = useState(null);
  const [estadisticasInventario, setEstadisticasInventario] = useState(null);
  const [estadisticasReservas, setEstadisticasReservas] = useState(null);

  // Mostrar notificación
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  /**
   * Obtener estadísticas generales del dashboard
   */
  const fetchEstadisticasGenerales = useCallback(
    async (periodo = "hoy") => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasGenerales(
          periodo
        );

        if (response.success) {
          setEstadisticasGenerales(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas generales";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasGenerales:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Obtener estadísticas de ventas
   */
  const fetchEstadisticasVentas = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasVentas(
          params
        );

        if (response.success) {
          setEstadisticasVentas(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas de ventas";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasVentas:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Obtener estadísticas de productos
   */
  const fetchEstadisticasProductos = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasProductos(
          params
        );

        if (response.success) {
          setEstadisticasProductos(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas de productos";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasProductos:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Obtener estadísticas de mesas
   */
  const fetchEstadisticasMesas = useCallback(
    async (fecha = null) => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasMesas(fecha);

        if (response.success) {
          setEstadisticasMesas(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas de mesas";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasMesas:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Obtener estadísticas de empleados
   */
  const fetchEstadisticasEmpleados = useCallback(
    async (periodo = "mes") => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasEmpleados(
          periodo
        );

        if (response.success) {
          setEstadisticasEmpleados(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas de empleados";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasEmpleados:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Obtener estadísticas de inventario
   */
  const fetchEstadisticasInventario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await estadisticasService.getEstadisticasInventario();

      if (response.success) {
        setEstadisticasInventario(response.data);
        return response.data;
      }
    } catch (err) {
      const errorMessage =
        err.message || "Error al cargar estadísticas de inventario";
      setError(errorMessage);
      showNotification(errorMessage, "error");
      console.error("Error en fetchEstadisticasInventario:", err);
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  /**
   * Obtener estadísticas de reservas
   */
  const fetchEstadisticasReservas = useCallback(
    async (periodo = "mes") => {
      try {
        setLoading(true);
        setError(null);
        const response = await estadisticasService.getEstadisticasReservas(
          periodo
        );

        if (response.success) {
          setEstadisticasReservas(response.data);
          return response.data;
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar estadísticas de reservas";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en fetchEstadisticasReservas:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar notificación
   */
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    // Estados
    loading,
    error,
    notification,

    // Datos
    estadisticasGenerales,
    estadisticasVentas,
    estadisticasProductos,
    estadisticasMesas,
    estadisticasEmpleados,
    estadisticasInventario,
    estadisticasReservas,

    // Métodos
    fetchEstadisticasGenerales,
    fetchEstadisticasVentas,
    fetchEstadisticasProductos,
    fetchEstadisticasMesas,
    fetchEstadisticasEmpleados,
    fetchEstadisticasInventario,
    fetchEstadisticasReservas,
    clearError,
    clearNotification,
    showNotification,
  };
};
