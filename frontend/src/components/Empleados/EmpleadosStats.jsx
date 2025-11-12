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

  const stats = [
    {
      label: "Total Empleados",
      value: totalEmpleados,
      colorClass: "text-primary",
      icon: (
        <svg
          className="w-6 h-6 text-primary/60"
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
      ),
    },
    {
      label: "Activos",
      value: empleadosActivos,
      colorClass: "text-success",
      icon: (
        <svg
          className="w-6 h-6 text-success/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Inactivos",
      value: empleadosInactivos,
      colorClass: "text-gray-500",
      icon: (
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
    },
    {
      label: "Roles",
      value: totalRoles,
      colorClass: "text-accent",
      icon: (
        <svg
          className="w-6 h-6 text-accent/60"
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
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-textSecondary">{stat.label}</p>
            {stat.icon}
          </div>
          <p className={`text-3xl font-bold ${stat.colorClass}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EmpleadosStats;
