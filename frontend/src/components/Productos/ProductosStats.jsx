import { useMemo } from "react";
import { Package, CheckCircle, XCircle, Star } from "lucide-react";

/**
 * Componente de estadísticas para el módulo de Productos
 * Muestra métricas clave: Total, Disponibles, No Disponibles, Destacados
 */
const ProductosStats = ({ stats }) => {
  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "total",
        label: "Total Productos",
        value: stats.total,
        icon: Package,
        color: "#581845", // Primary
        bgColor: "rgba(88, 24, 69, 0.1)",
      },
      {
        id: "disponibles",
        label: "Disponibles",
        value: stats.disponibles,
        icon: CheckCircle,
        color: "#10b981", // Green
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        id: "noDisponibles",
        label: "No Disponibles",
        value: stats.noDisponibles,
        icon: XCircle,
        color: "#ef4444", // Red
        bgColor: "rgba(239, 68, 68, 0.1)",
      },
      {
        id: "destacados",
        label: "Destacados",
        value: stats.destacados,
        icon: Star,
        color: "#e6af2e", // Accent
        bgColor: "rgba(230, 175, 46, 0.1)",
      },
    ],
    [stats]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default ProductosStats;
