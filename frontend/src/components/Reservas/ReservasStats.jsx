import { useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  UserX,
} from "lucide-react";

/**
 * Componente de estadísticas para el módulo de Reservas
 */
const ReservasStats = ({ stats = {} }) => {
  // Extraer datos de estadísticas
  const {
    pendientes = 0,
    confirmadas = 0,
    sentadas = 0,
    completadas = 0,
    canceladas = 0,
    noShow = 0,
    hoy = 0,
    mañana = 0,
    totalPersonas = 0,
  } = stats;

  // Calcular total de reservas activas (excluyendo completadas, canceladas y no_show)
  const activas = useMemo(() => {
    return pendientes + confirmadas + sentadas;
  }, [pendientes, confirmadas, sentadas]);

  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "activas",
        label: "Activas",
        value: activas,
        icon: Clock,
        color: "#3b82f6", // Blue
        bgColor: "rgba(59, 130, 246, 0.1)",
      },
      {
        id: "hoy",
        label: "Hoy",
        value: hoy,
        icon: CalendarDays,
        color: "#10b981", // Green
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        id: "mañana",
        label: "Mañana",
        value: mañana,
        icon: CalendarDays,
        color: "#f59e0b", // Amber
        bgColor: "rgba(245, 158, 11, 0.1)",
      },
      {
        id: "completadas",
        label: "Completadas",
        value: completadas,
        icon: CheckCircle2,
        color: "#6b7280", // Gray
        bgColor: "rgba(107, 114, 128, 0.1)",
      },
      {
        id: "canceladas",
        label: "Canceladas",
        value: canceladas,
        icon: XCircle,
        color: "#ef4444", // Red
        bgColor: "rgba(239, 68, 68, 0.1)",
      },
      {
        id: "noShow",
        label: "No Show",
        value: noShow,
        icon: UserX,
        color: "#8b5cf6", // Purple
        bgColor: "rgba(139, 92, 246, 0.1)",
      },
      {
        id: "personas",
        label: "Personas Esperadas",
        value: totalPersonas,
        icon: Users,
        color: "#06b6d4", // Cyan
        bgColor: "rgba(6, 182, 212, 0.1)",
      },
    ],
    [activas, hoy, mañana, completadas, canceladas, noShow, totalPersonas]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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

export default ReservasStats;
