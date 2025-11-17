import { useState, useEffect } from "react";
import { BarChart3, DollarSign, Package, Users, Download } from "lucide-react";
import { useEstadisticas } from "../../hooks/useEstadisticas";
import jsPDF from "jspdf";
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
  const [exportando, setExportando] = useState(false);

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

  // Exportar estadísticas a PDF
  const handleExportar = async () => {
    try {
      setExportando(true);

      // Crear el PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Colores del tema
      const primaryColor = [88, 24, 69]; // #581845
      const accentColor = [230, 175, 46]; // #e6af2e
      const textColor = [31, 41, 55]; // #1f2937

      // Fecha
      const fecha = new Date().toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Header con fondo
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 40, "F");

      // Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont(undefined, "bold");
      doc.text("INFORME DE ESTADÍSTICAS", pageWidth / 2, 20, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Fecha: ${fecha}`, pageWidth / 2, 30, { align: "center" });

      yPos = 50;

      // Período
      doc.setTextColor(...textColor);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Período analizado: ${periodo.toUpperCase()}`, 15, yPos);
      yPos += 15;

      // Estadísticas Generales
      if (estadisticasGenerales?.stats) {
        const stats = estadisticasGenerales.stats;

        // Título de sección
        doc.setFillColor(...accentColor);
        doc.rect(10, yPos - 5, pageWidth - 20, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("ESTADÍSTICAS GENERALES", 15, yPos + 2);
        yPos += 15;

        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        const statsData = [
          [
            "Ventas Total:",
            `$${parseFloat(stats.ventasTotal || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}`,
          ],
          [
            "Cambio vs período anterior:",
            `${stats.cambioVentas > 0 ? "+" : ""}${stats.cambioVentas}%`,
          ],
          ["Pedidos Completados:", `${stats.pedidosCompletados || 0}`],
          ["Pedidos Activos:", `${stats.pedidosActivos || 0}`],
          [
            "Mesas Ocupadas:",
            `${stats.mesasOcupadas || 0} de ${stats.mesasTotal || 0}`,
          ],
          ["Ocupación:", `${stats.porcentajeOcupacion || 0}%`],
          ["Reservas de Hoy:", `${stats.reservasHoy || 0}`],
          [
            "Ticket Promedio:",
            `$${parseFloat(stats.ticketPromedio || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}`,
          ],
        ];

        statsData.forEach(([label, value]) => {
          doc.setFont(undefined, "bold");
          doc.text(label, 15, yPos);
          doc.setFont(undefined, "normal");
          doc.text(value, 100, yPos);
          yPos += 7;
        });

        yPos += 5;
      }

      // Resumen de Ventas
      if (estadisticasVentas?.resumen && yPos < pageHeight - 60) {
        const resumen = estadisticasVentas.resumen;

        doc.setFillColor(...accentColor);
        doc.rect(10, yPos - 5, pageWidth - 20, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("RESUMEN DE VENTAS", 15, yPos + 2);
        yPos += 15;

        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        const resumenData = [
          [
            "Total:",
            `$${parseFloat(resumen.ventasTotal || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}`,
          ],
          [
            "Promedio por día:",
            `$${parseFloat(resumen.ventasPromedio || 0).toLocaleString(
              "es-MX",
              { minimumFractionDigits: 2 }
            )}`,
          ],
          [
            "Mejor día:",
            `$${parseFloat(resumen.mejorDia || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}`,
          ],
          ["Total pedidos:", `${resumen.totalPedidos || 0}`],
          [
            "Ticket promedio:",
            `$${parseFloat(resumen.ticketPromedio || 0).toLocaleString(
              "es-MX",
              { minimumFractionDigits: 2 }
            )}`,
          ],
        ];

        resumenData.forEach(([label, value]) => {
          doc.setFont(undefined, "bold");
          doc.text(label, 15, yPos);
          doc.setFont(undefined, "normal");
          doc.text(value, 100, yPos);
          yPos += 7;
        });

        yPos += 5;
      }

      // Top Productos
      if (estadisticasProductos?.topProductosPorIngresos?.length > 0) {
        // Nueva página si es necesario
        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFillColor(...accentColor);
        doc.rect(10, yPos - 5, pageWidth - 20, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("TOP PRODUCTOS POR INGRESOS", 15, yPos + 2);
        yPos += 15;

        doc.setTextColor(...textColor);
        doc.setFontSize(9);

        estadisticasProductos.topProductosPorIngresos
          .slice(0, 10)
          .forEach((producto, index) => {
            if (yPos > pageHeight - 20) {
              doc.addPage();
              yPos = 20;
            }

            doc.setFont(undefined, "bold");
            doc.text(`${index + 1}.`, 15, yPos);
            doc.setFont(undefined, "normal");

            const nombre =
              producto.nombre.length > 35
                ? producto.nombre.substring(0, 32) + "..."
                : producto.nombre;
            doc.text(nombre, 25, yPos);

            doc.setFont(undefined, "bold");
            doc.text(
              `$${parseFloat(producto.ingresos || 0).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
              })}`,
              120,
              yPos
            );
            doc.setFont(undefined, "normal");
            doc.text(`(${producto.cantidadVendida || 0} vendidos)`, 160, yPos);

            yPos += 6;
          });

        yPos += 5;
      }

      // Performance de Meseros
      if (estadisticasEmpleados?.performanceMeseros?.length > 0) {
        // Nueva página si es necesario
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFillColor(...accentColor);
        doc.rect(10, yPos - 5, pageWidth - 20, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("PERFORMANCE DE MESEROS", 15, yPos + 2);
        yPos += 15;

        doc.setTextColor(...textColor);
        doc.setFontSize(9);

        estadisticasEmpleados.performanceMeseros.forEach((mesero, index) => {
          if (yPos > pageHeight - 20) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFont(undefined, "bold");
          doc.text(`${index + 1}.`, 15, yPos);
          doc.setFont(undefined, "normal");
          doc.text(mesero.nombre, 25, yPos);

          doc.text(`Pedidos: ${mesero.pedidosCompletados || 0}`, 100, yPos);
          doc.setFont(undefined, "bold");
          doc.text(
            `$${parseFloat(mesero.ventasTotal || 0).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
            })}`,
            140,
            yPos
          );

          yPos += 6;
        });
      }

      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleDateString(
            "es-ES"
          )}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Descargar PDF
      doc.save(
        `informe-estadisticas-${periodo}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error al exportar:", error);
    } finally {
      setExportando(false);
    }
  };

  // Ya no necesitamos la función generarContenidoInforme

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

        {/* Botón de exportar */}
        <button
          onClick={handleExportar}
          disabled={exportando || loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Download className="w-5 h-5" />
          {exportando ? "Exportando..." : "Exportar Informe"}
        </button>
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
          <BarChart3 className="w-6 h-6" />
          Resumen del Período
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resumen de ventas */}
          {estadisticasVentas?.resumen && (
            <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-xl p-5 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
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
                  <Package className="w-5 h-5 text-white" />
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
                  <Users className="w-5 h-5 text-white" />
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
