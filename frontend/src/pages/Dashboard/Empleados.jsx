import { useState } from "react";
import colors from "../../styles/colors";

const Empleados = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Todos");

  const roles = [
    "Todos",
    "Mesero",
    "Cocinero",
    "Bartender",
    "Gerente",
    "Cajero",
  ];

  const [employees] = useState([
    {
      id: "EMP-001",
      nombre: "Carlos López",
      email: "carlos.lopez@bites.com",
      telefono: "555-0201",
      rol: "Mesero",
      turno: "Matutino",
      salario: 1200,
      fechaIngreso: "2024-01-15",
      estado: "Activo",
      foto: "👨‍💼",
    },
    {
      id: "EMP-002",
      nombre: "Ana Martínez",
      email: "ana.martinez@bites.com",
      telefono: "555-0202",
      rol: "Mesero",
      turno: "Vespertino",
      salario: 1200,
      fechaIngreso: "2024-02-20",
      estado: "Activo",
      foto: "👩‍💼",
    },
    {
      id: "EMP-003",
      nombre: "Roberto Silva",
      email: "roberto.silva@bites.com",
      telefono: "555-0203",
      rol: "Cocinero",
      turno: "Matutino",
      salario: 1500,
      fechaIngreso: "2023-11-10",
      estado: "Activo",
      foto: "👨‍🍳",
    },
    {
      id: "EMP-004",
      nombre: "Laura Hernández",
      email: "laura.hernandez@bites.com",
      telefono: "555-0204",
      rol: "Cocinero",
      turno: "Vespertino",
      salario: 1500,
      fechaIngreso: "2024-03-05",
      estado: "Activo",
      foto: "👩‍🍳",
    },
    {
      id: "EMP-005",
      nombre: "Miguel Ángel Ruiz",
      email: "miguel.ruiz@bites.com",
      telefono: "555-0205",
      rol: "Bartender",
      turno: "Nocturno",
      salario: 1300,
      fechaIngreso: "2024-01-20",
      estado: "Activo",
      foto: "🧑‍🍳",
    },
    {
      id: "EMP-006",
      nombre: "Patricia Gómez",
      email: "patricia.gomez@bites.com",
      telefono: "555-0206",
      rol: "Gerente",
      turno: "Matutino",
      salario: 2500,
      fechaIngreso: "2023-08-01",
      estado: "Activo",
      foto: "👩‍💼",
    },
    {
      id: "EMP-007",
      nombre: "Diego Fernández",
      email: "diego.fernandez@bites.com",
      telefono: "555-0207",
      rol: "Cajero",
      turno: "Vespertino",
      salario: 1100,
      fechaIngreso: "2024-04-12",
      estado: "Activo",
      foto: "👨‍💼",
    },
    {
      id: "EMP-008",
      nombre: "Sofía Ramírez",
      email: "sofia.ramirez@bites.com",
      telefono: "555-0208",
      rol: "Mesero",
      turno: "Nocturno",
      salario: 1200,
      fechaIngreso: "2024-05-18",
      estado: "Vacaciones",
      foto: "👩‍💼",
    },
  ]);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "Todos" || emp.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (estado) => {
    const statusColors = {
      Activo: { bg: "#10B98120", color: "#10B981" },
      Inactivo: { bg: "#6B728020", color: "#6B7280" },
      Vacaciones: { bg: "#3B82F620", color: "#3B82F6" },
      Suspendido: { bg: "#EF444420", color: "#EF4444" },
    };
    return statusColors[estado] || statusColors["Activo"];
  };

  const getTurnoIcon = (turno) => {
    const icons = {
      Matutino: "🌅",
      Vespertino: "🌆",
      Nocturno: "🌙",
    };
    return icons[turno] || "🕐";
  };

  const EmployeeModal = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => setShowModal(false)}
    >
      <div
        className="rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Nuevo Empleado
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
            style={{ color: colors.text }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Email *
              </label>
              <input
                type="email"
                placeholder="empleado@bites.com"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Teléfono *
              </label>
              <input
                type="tel"
                placeholder="555-0000"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Rol / Puesto *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                {roles
                  .filter((r) => r !== "Todos")
                  .map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Turno *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                <option value="Matutino">Matutino (6:00 - 14:00)</option>
                <option value="Vespertino">Vespertino (14:00 - 22:00)</option>
                <option value="Nocturno">Nocturno (22:00 - 6:00)</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Salario Mensual ($) *
              </label>
              <input
                type="number"
                placeholder="0.00"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Dirección
              </label>
              <textarea
                rows="2"
                placeholder="Dirección completa del empleado..."
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                color: colors.text,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.primary }}
            >
              Registrar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
            Empleados
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Gestión del personal del restaurante
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          style={{ backgroundColor: colors.primary }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Empleado
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Total Empleados
          </p>
          <p className="text-3xl font-bold" style={{ color: colors.primary }}>
            {employees.length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Activos
          </p>
          <p className="text-3xl font-bold" style={{ color: "#10B981" }}>
            {employees.filter((e) => e.estado === "Activo").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            En Vacaciones
          </p>
          <p className="text-3xl font-bold" style={{ color: "#3B82F6" }}>
            {employees.filter((e) => e.estado === "Vacaciones").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Nómina Total
          </p>
          <p className="text-2xl font-bold" style={{ color: colors.accent }}>
            ${employees.reduce((sum, e) => sum + e.salario, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Buscar Empleado
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.textSecondary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text }}
            >
              Filtrar por Rol
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
              style={{
                borderColor: colors.secondary + "40",
                backgroundColor: colors.background,
              }}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const statusColor = getStatusColor(employee.estado);
          return (
            <div
              key={employee.id}
              className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "white" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="text-4xl w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}
                  >
                    {employee.foto}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.primary }}>
                      {employee.nombre}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {employee.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Rol
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.accent + "20",
                      color: colors.accent,
                    }}
                  >
                    {employee.rol}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Turno
                  </span>
                  <span
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: colors.text }}
                  >
                    {getTurnoIcon(employee.turno)} {employee.turno}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Salario
                  </span>
                  <span className="font-bold" style={{ color: colors.primary }}>
                    ${employee.salario.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    Estado
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                    }}
                  >
                    {employee.estado}
                  </span>
                </div>

                <div
                  className="pt-3 mt-3 border-t flex items-center justify-between"
                  style={{ borderColor: colors.secondary + "20" }}
                >
                  <div
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    <p>📧 {employee.email}</p>
                    <p>📞 {employee.telefono}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-2 rounded-lg font-medium border-2 hover:bg-blue-50 transition-colors text-sm"
                  style={{
                    borderColor: colors.secondary + "40",
                    color: colors.primary,
                  }}
                >
                  Ver Perfil
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  style={{ color: "#3B82F6" }}
                  title="Editar"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg font-medium" style={{ color: colors.text }}>
            No se encontraron empleados
          </p>
          <p style={{ color: colors.textSecondary }}>
            Intenta con otros filtros de búsqueda
          </p>
        </div>
      )}

      {showModal && <EmployeeModal />}
    </div>
  );
};

export default Empleados;
