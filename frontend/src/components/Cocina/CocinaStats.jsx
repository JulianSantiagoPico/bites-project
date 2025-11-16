import { Clock, ChefHat, CheckCircle, TrendingUp } from "lucide-react";

/**
 * Componente de estadísticas para el módulo de cocina
 */
const CocinaStats = ({ stats }) => {
  const statsData = [
    {
      label: "Pendientes",
      value: stats.pendientes || 0,
      icon: Clock,
      color: "#e6af2e",
      bgColor: "rgba(230, 175, 46, 0.1)",
    },
    {
      label: "En Preparación",
      value: stats.enPreparacion || 0,
      icon: ChefHat,
      color: "#581845",
      bgColor: "rgba(88, 24, 69, 0.1)",
    },
    {
      label: "Completados Hoy",
      value: stats.completadosHoy || 0,
      icon: CheckCircle,
      color: "#6bbf59",
      bgColor: "rgba(107, 191, 89, 0.1)",
    },
    {
      label: "Tiempo Promedio",
      value: `${stats.tiempoPromedioPreparacion || 0} min`,
      icon: TrendingUp,
      color: "#35524a",
      bgColor: "rgba(53, 82, 74, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
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

export default CocinaStats;
