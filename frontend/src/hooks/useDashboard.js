import { useState, useCallback, useEffect } from "react";
import { estadisticasService, pedidosService } from "../services/api";

/**
 * Hook personalizado para manejar datos del Dashboard Home
 * Proporciona estadísticas generales, órdenes recientes y productos top
 */
export const useDashboard = () => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Datos del dashboard
  const [stats, setStats] = useState({
    ventasHoy: 0,
    cambioVentas: 0,
    ordenesActivas: 0,
    mesasOcupadas: 0,
    totalMesas: 0,
    porcentajeOcupacion: 0,
    reservasHoy: 0,
    ticketPromedio: 0,
    pedidosCompletados: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Mostrar notificación
  const showNotification = useCallback((message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Limpiar notificación
  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  /**
   * Cargar estadísticas generales del dashboard
   */
  const loadDashboardData = useCallback(
    async (periodo = "hoy") => {
      try {
        setLoading(true);
        setError(null);

        // Hacer todas las llamadas en paralelo
        const [statsResponse, productosResponse, pedidosResponse] =
          await Promise.all([
            estadisticasService.getEstadisticasGenerales(periodo),
            estadisticasService.getEstadisticasProductos({
              periodo: periodo, // Usar el mismo período que las estadísticas generales
              limit: 4,
            }),
            pedidosService.getPedidos({
              // No enviar filtro de estado para obtener todos los pedidos activos
            }),
          ]);

        // Mapear datos de estadísticas
        if (statsResponse.success) {
          const data = statsResponse.data;

          setStats({
            ventasHoy: parseFloat(data.stats.ventasTotal || 0),
            cambioVentas: parseFloat(data.stats.cambioVentas || 0),
            ordenesActivas: data.stats.pedidosActivos || 0,
            mesasOcupadas: data.stats.mesasOcupadas || 0,
            totalMesas: data.stats.mesasTotal || 0,
            porcentajeOcupacion: parseFloat(
              data.stats.porcentajeOcupacion || 0
            ),
            reservasHoy: data.stats.reservasHoy || 0,
            ticketPromedio: parseFloat(data.stats.ticketPromedio || 0),
            pedidosCompletados: data.stats.pedidosCompletados || 0,
          });
        }

        // Mapear productos top
        if (
          productosResponse.success &&
          productosResponse.data.topProductosPorIngresos
        ) {
          setTopProducts(
            productosResponse.data.topProductosPorIngresos.slice(0, 4)
          );
        }

        // Mapear órdenes recientes (todas, ordenadas por fecha)
        if (pedidosResponse.success && pedidosResponse.data.pedidos) {
          // Tomar las últimas 4 órdenes (ya vienen ordenadas por createdAt desc)
          const ordenesRecientes = pedidosResponse.data.pedidos.slice(0, 4);
          setRecentOrders(ordenesRecientes);
        }
      } catch (err) {
        const errorMessage =
          err.message || "Error al cargar datos del dashboard";
        setError(errorMessage);
        showNotification(errorMessage, "error");
        console.error("Error en loadDashboardData:", err);
      } finally {
        setLoading(false);
      }
    },
    [showNotification]
  );

  /**
   * Recargar datos del dashboard
   */
  const refreshDashboard = useCallback(async () => {
    await loadDashboardData("hoy");
  }, [loadDashboardData]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData("hoy");
  }, [loadDashboardData]);

  return {
    // Estados
    loading,
    error,
    notification,

    // Datos
    stats,
    recentOrders,
    topProducts,

    // Métodos
    loadDashboardData,
    refreshDashboard,
    clearNotification,
  };
};
