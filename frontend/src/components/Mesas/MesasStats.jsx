import { useMemo } from "react";
import { LayoutGrid, CheckCircle, Circle, Calendar, Sparkles, Users } from "lucide-react";

const MesasStats = ({ stats }) => {
  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "total",
        label: "Total Mesas",
        value: stats.total,
        icon: LayoutGrid,
        color: "#FF6B6B", // Primary red
        bgColor: "rgba(255, 107, 107, 0.1)",
      },
      {
        id: "disponibles",
        label: "Disponibles",
        value: stats.disponibles,
        icon: CheckCircle,
        color: "#10B981", // Green
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        id: "ocupadas",
        label: "Ocupadas",
        value: stats.ocupadas,
        icon: Circle,
        color: "#EF4444", // Red
        bgColor: "rgba(239, 68, 68, 0.1)",
      },
      {
        id: "reservadas",
        label: "Reservadas",
        value: stats.reservadas,
        icon: Calendar,
        color: "#3B82F6", // Blue
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        id: "limpieza",
        label: "En Limpieza",
        value: stats.enLimpieza,
        icon: Sparkles,
        color: "#F59E0B", // Amber
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        id: "capacidad",
        label: "Capacidad Total",
        value: stats.capacidadTotal,
        icon: Users,
        color: "#F97316", // Orange (accent)
        bgColor: "rgba(249, 115, 22, 0.1)",
        subtitle: "personas",
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-md p-4 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "#6b7280" }}
                >
                  {stat.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-textSecondary mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon size={24} style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MesasStats;
