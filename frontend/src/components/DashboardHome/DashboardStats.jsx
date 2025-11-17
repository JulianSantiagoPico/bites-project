import { useMemo } from "react";
import {
  DollarSign,
  FileText,
  Table,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/**
 * Componente de estadísticas principales del Dashboard
 * Muestra métricas clave: Ventas, Órdenes, Mesas, Reservas
 */
const DashboardStats = ({ stats, loading }) => {
  // Calcular el texto de mesas ocupadas
  const mesasText = useMemo(() => {
    if (stats.totalMesas === 0) return "0/0";
    return `${stats.mesasOcupadas}/${stats.totalMesas}`;
  }, [stats.mesasOcupadas, stats.totalMesas]);

  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "ventas",
        title: "Ventas Hoy",
        value: `$${stats.ventasHoy.toFixed(2)}`,
        change: `${
          stats.cambioVentas >= 0 ? "+" : ""
        }${stats.cambioVentas.toFixed(1)}%`,
        trend: stats.cambioVentas >= 0 ? "up" : "down",
        icon: DollarSign,
        color: "#581845", // Primary
        bgColor: "rgba(88, 24, 69, 0.1)",
      },
      {
        id: "ordenes",
        title: "Órdenes Activas",
        value: stats.ordenesActivas.toString(),
        change: `${stats.pedidosCompletados} completados`,
        trend: "neutral",
        icon: FileText,
        color: "#e6af2e", // Accent
        bgColor: "rgba(230, 175, 46, 0.1)",
      },
      {
        id: "mesas",
        title: "Mesas Ocupadas",
        value: mesasText,
        change: `${stats.porcentajeOcupacion.toFixed(0)}%`,
        trend: "neutral",
        icon: Table,
        color: "#35524a", // Secondary
        bgColor: "rgba(53, 82, 74, 0.1)",
      },
      {
        id: "reservas",
        title: "Reservas Hoy",
        value: stats.reservasHoy.toString(),
        change: `Ticket: $${stats.ticketPromedio.toFixed(2)}`,
        trend: "neutral",
        icon: Calendar,
        color: "#10B981", // Success
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
    ],
    [stats, mesasText]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl p-6 shadow-md bg-white animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;

        return (
          <div
            key={metric.id}
            className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-textSecondary">
                  {metric.title}
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </h3>
                <div className="flex items-center mt-2 gap-1">
                  {metric.trend !== "neutral" && (
                    <TrendIcon
                      className="w-4 h-4"
                      style={{
                        color: metric.trend === "up" ? "#10B981" : "#ef4444",
                      }}
                    />
                  )}
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        metric.trend === "up"
                          ? "#10B981"
                          : metric.trend === "down"
                          ? "#ef4444"
                          : "#7d7d7d",
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: metric.bgColor }}
              >
                <Icon className="w-8 h-8" style={{ color: metric.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
