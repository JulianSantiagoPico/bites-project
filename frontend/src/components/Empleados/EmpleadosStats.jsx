import { useMemo } from "react";
import { Users, CheckCircle2, UserX, Briefcase } from "lucide-react";

/**
 * Componente de estadísticas para el módulo de empleados
 * Muestra contadores de: Total, Activos, Inactivos y Roles únicos
 */
const EmpleadosStats = ({ employees }) => {
  // Calcular estadísticas
  const totalEmpleados = employees.length;
  const empleadosActivos = employees.filter((e) => e.activo).length;
  const empleadosInactivos = employees.filter((e) => !e.activo).length;
  const totalRoles = new Set(employees.map((e) => e.rol)).size;

  // Definir las tarjetas de estadísticas
  const statsCards = useMemo(
    () => [
      {
        id: "total",
        label: "Total Empleados",
        value: totalEmpleados,
        icon: Users,
        color: "#FF6B6B", // Primary red
        bgColor: "rgba(255, 107, 107, 0.1)",
      },
      {
        id: "activos",
        label: "Activos",
        value: empleadosActivos,
        icon: CheckCircle2,
        color: "#10b981", // Green
        bgColor: "rgba(16, 185, 129, 0.1)",
      },
      {
        id: "inactivos",
        label: "Inactivos",
        value: empleadosInactivos,
        icon: UserX,
        color: "#6b7280", // Gray
        bgColor: "rgba(107, 114, 128, 0.1)",
      },
      {
        id: "roles",
        label: "Roles",
        value: totalRoles,
        icon: Briefcase,
        color: "#F97316", // Accent orange
        bgColor: "rgba(249, 115, 22, 0.1)",
      },
    ],
    [totalEmpleados, empleadosActivos, empleadosInactivos, totalRoles]
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

export default EmpleadosStats;
