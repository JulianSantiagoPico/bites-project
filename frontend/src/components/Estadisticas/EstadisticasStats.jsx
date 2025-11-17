import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
} from "lucide-react";

/**
 * Componente de tarjetas de estadísticas principales
 * Muestra métricas clave con iconos y tendencias
 */
const EstadisticasStats = ({ stats, loading }) => {
  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        id: "ventas",
        label: "Ventas Totales",
        value: `$${parseFloat(stats.ventasTotal || 0).toLocaleString("es-CO", {
          minimumFractionDigits: 2,
        })}`,
        change: stats.cambioVentas || 0,
        icon: DollarSign,
        color: "#581845", // Primary
        bgColor: "rgba(88, 24, 69, 0.1)",
      },
      {
        id: "pedidos",
        label: "Pedidos Activos",
        value: stats.pedidosActivos || 0,
        subValue: `${stats.pedidosCompletados || 0} completados`,
        icon: ShoppingCart,
        color: "#e6af2e", // Accent
        bgColor: "rgba(230, 175, 46, 0.1)",
      },
      {
        id: "mesas",
        label: "Ocupación de Mesas",
        value: `${stats.mesasOcupadas || 0}/${stats.mesasTotal || 0}`,
        subValue: `${stats.porcentajeOcupacion || 0}% ocupadas`,
        icon: Users,
        color: "#35524a", // Secondary
        bgColor: "rgba(53, 82, 74, 0.1)",
      },
      {
        id: "reservas",
        label: "Reservas Hoy",
        value: stats.reservasHoy || 0,
        subValue: `${stats.reservasConfirmadas || 0} confirmadas`,
        icon: Calendar,
        color: "#6bbf59", // Success
        bgColor: "rgba(107, 191, 89, 0.1)",
      },
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        const hasChange = stat.change !== undefined;
        const isPositive = stat.change > 0;
        const isNegative = stat.change < 0;

        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-md p-6 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-textSecondary mb-1">
                  {stat.label}
                </p>
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>

                {/* Cambio porcentual o valor secundario */}
                {hasChange ? (
                  <div className="flex items-center gap-1 text-sm">
                    {isPositive && (
                      <>
                        <TrendingUp size={16} className="text-success" />
                        <span className="text-success font-medium">
                          +{stat.change}%
                        </span>
                      </>
                    )}
                    {isNegative && (
                      <>
                        <TrendingDown size={16} className="text-error" />
                        <span className="text-error font-medium">
                          {stat.change}%
                        </span>
                      </>
                    )}
                    {!isPositive && !isNegative && (
                      <span className="text-textSecondary">Sin cambios</span>
                    )}
                    <span className="text-textSecondary">
                      vs período anterior
                    </span>
                  </div>
                ) : stat.subValue ? (
                  <p className="text-sm text-textSecondary">{stat.subValue}</p>
                ) : null}
              </div>

              {/* Icono */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon size={28} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EstadisticasStats;
