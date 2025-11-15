import { useMemo } from "react";
import {
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "../../utils/pedidosUtils";

/**
 * Componente para mostrar estadísticas de pedidos
 */
const PedidosStats = ({ stats }) => {
  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "total",
        label: "Total Pedidos",
        value: stats.total || 0,
        icon: ClipboardList,
        color: "#581845",
        bgColor: "rgba(88, 24, 69, 0.1)",
      },
      {
        id: "pendientes",
        label: "Pendientes",
        value: stats.pendientes || 0,
        icon: Clock,
        color: "#ffd166",
        bgColor: "rgba(255, 209, 102, 0.1)",
      },
      {
        id: "enPreparacion",
        label: "En Cocina",
        value: stats.enPreparacion || 0,
        icon: ChefHat,
        color: "#4A90E2",
        bgColor: "rgba(74, 144, 226, 0.1)",
      },
      {
        id: "listos",
        label: "Listos",
        value: stats.listos || 0,
        icon: CheckCircle,
        color: "#6bbf59",
        bgColor: "rgba(107, 191, 89, 0.1)",
      },
      {
        id: "entregados",
        label: "Entregados",
        value: stats.entregados || 0,
        icon: Package,
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
      },
      {
        id: "ventas",
        label: "Ventas Total",
        value: formatPrice(stats.ventasTotal || 0),
        icon: DollarSign,
        color: "#e6af2e",
        bgColor: "rgba(230, 175, 46, 0.1)",
        isPrice: true,
      },
      {
        id: "ticketPromedio",
        label: "Ticket Promedio",
        value: formatPrice(stats.ticketPromedio || 0),
        icon: TrendingUp,
        color: "#35524a",
        bgColor: "rgba(53, 82, 74, 0.1)",
        isPrice: true,
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-sm p-3 transition-all duration-200 hover:shadow-md border"
            style={{ borderColor: "#F3F4F6" }}
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <p
                  className="text-xs font-medium leading-tight"
                  style={{ color: "#9CA3AF" }}
                >
                  {stat.label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <p
                className={`font-bold leading-none ${
                  stat.isPrice ? "text-lg" : "text-2xl"
                }`}
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PedidosStats;
