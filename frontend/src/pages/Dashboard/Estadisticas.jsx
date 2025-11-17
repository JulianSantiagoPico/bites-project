import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { useEstadisticas } from "../../hooks/useEstadisticas";
import Notification from "../../components/Notification";
import EstadisticasStats from "../../components/Estadisticas/EstadisticasStats";
import EstadisticasFilters from "../../components/Estadisticas/EstadisticasFilters";
import VentasChart from "../../components/Estadisticas/VentasChart";
import ProductosChart from "../../components/Estadisticas/ProductosChart";
import OcupacionChart from "../../components/Estadisticas/OcupacionChart";
import EstadosPedidosChart from "../../components/Estadisticas/EstadosPedidosChart";
import MeserosPerformanceTable from "../../components/Estadisticas/MeserosPerformanceTable";

const Estadisticas = () => {
  const {
    loading,
    notification,
    estadisticasGenerales,
    estadisticasVentas,
    estadisticasProductos,
    estadisticasEmpleados,
    fetchEstadisticasGenerales,
    fetchEstadisticasVentas,
    fetchEstadisticasProductos,
    fetchEstadisticasEmpleados,
    clearNotification,
  } = useEstadisticas();

  const [periodo, setPeriodo] = useState("mes");

  // Cargar datos iniciales
  useEffect(() => {
    loadAllEstadisticas(periodo);
  }, []);

  // Cargar todas las estadísticas
  const loadAllEstadisticas = async (nuevoPeriodo) => {
    await Promise.all([
      fetchEstadisticasGenerales(nuevoPeriodo),
      fetchEstadisticasVentas({ periodo: nuevoPeriodo }),
      fetchEstadisticasProductos({ periodo: nuevoPeriodo, limit: 10 }),
      fetchEstadisticasEmpleados(nuevoPeriodo),
    ]);
  };

  // Manejar cambio de período
  const handlePeriodoChange = (nuevoPeriodo) => {
    setPeriodo(nuevoPeriodo);
    loadAllEstadisticas(nuevoPeriodo);
  };

  return (
    <div className="space-y-6">
      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <BarChart3 size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Estadísticas y Métricas
            </h1>
            <p className="text-textSecondary">
              Panel de control con analítica en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* Filtros de período */}
      <EstadisticasFilters
        periodo={periodo}
        onPeriodoChange={handlePeriodoChange}
        loading={loading}
      />

      {/* Tarjetas de estadísticas principales */}
      <EstadisticasStats
        stats={estadisticasGenerales?.stats}
        loading={loading}
      />

      {/* Gráficos - Fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <VentasChart
          data={estadisticasVentas?.ventasPorDia}
          loading={loading}
        />

        {/* Gráfico de ocupación/horas pico */}
        <OcupacionChart
          data={estadisticasVentas?.ventasPorHora}
          loading={loading}
        />
      </div>

      {/* Gráficos - Fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de top productos */}
        <ProductosChart
          data={estadisticasProductos?.topProductosPorIngresos}
          loading={loading}
        />

        {/* Gráfico de distribución de pedidos */}
        <EstadosPedidosChart
          stats={estadisticasGenerales?.stats}
          loading={loading}
        />
      </div>

      {/* Tabla de performance de meseros */}
      <MeserosPerformanceTable
        data={estadisticasEmpleados?.performanceMeseros}
        loading={loading}
      />

      {/* Resumen del Período - Mejorado */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Resumen del Período
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumen de ventas */}
          {estadisticasVentas?.resumen && (
            <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-xl p-5 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-primary">Ventas</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">Total:</span>
                  <span className="font-bold text-lg text-primary">
                    $
                    {parseFloat(
                      estadisticasVentas.resumen.ventasTotal
                    ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">Propinas:</span>
                  <span className="font-semibold text-accent">
                    $
                    {parseFloat(
                      estadisticasVentas.resumen.propinaTotal
                    ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Ticket Promedio:
                  </span>
                  <span className="font-semibold text-secondary">
                    $
                    {parseFloat(
                      estadisticasVentas.resumen.ticketPromedio
                    ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="text-sm text-textSecondary">
                    Total Pedidos:
                  </span>
                  <span className="font-bold text-lg text-textMain">
                    {estadisticasVentas.resumen.totalPedidos}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de productos */}
          {estadisticasProductos && (
            <div className="bg-linear-to-br from-accent/5 to-accent/10 rounded-xl p-5 border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-accent rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-accent">Productos</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Total Vendidos:
                  </span>
                  <span className="font-bold text-lg text-accent">
                    {estadisticasProductos.totalProductosVendidos?.toLocaleString(
                      "es-CO"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Categorías:
                  </span>
                  <span className="font-semibold text-secondary">
                    {estadisticasProductos.ventasPorCategoria?.length || 0}
                  </span>
                </div>
                <div className="pt-2 border-t border-accent/20">
                  <p className="text-xs text-textSecondary mb-1">
                    Top Producto:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {estadisticasProductos.topProductosPorIngresos?.[0]
                        ?.imagen || "🍽️"}
                    </span>
                    <span className="font-semibold text-sm text-primary">
                      {estadisticasProductos.topProductosPorIngresos?.[0]
                        ?.nombre || "N/A"}
                    </span>
                  </div>
                  {estadisticasProductos.topProductosPorIngresos?.[0] && (
                    <p className="text-xs text-textSecondary mt-1">
                      $
                      {parseFloat(
                        estadisticasProductos.topProductosPorIngresos[0]
                          .ingresos
                      ).toLocaleString("es-CO")}{" "}
                      en ingresos
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Resumen de equipo */}
          {estadisticasEmpleados?.statsEquipo && (
            <div className="bg-linear-to-br from-secondary/5 to-secondary/10 rounded-xl p-5 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-secondary rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-secondary">Equipo</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Total Meseros:
                  </span>
                  <span className="font-bold text-lg text-secondary">
                    {estadisticasEmpleados.statsEquipo.totalMeseros}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Ventas Totales:
                  </span>
                  <span className="font-semibold text-primary">
                    $
                    {parseFloat(
                      estadisticasEmpleados.statsEquipo.ventasTotal
                    ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-textSecondary">
                    Propinas Totales:
                  </span>
                  <span className="font-semibold text-success">
                    $
                    {parseFloat(
                      estadisticasEmpleados.statsEquipo.propinasTotal
                    ).toLocaleString("es-CO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-secondary/20">
                  <span className="text-sm text-textSecondary">
                    Pedidos Completados:
                  </span>
                  <span className="font-bold text-lg text-textMain">
                    {estadisticasEmpleados.statsEquipo.pedidosCompletados}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
