import { useState } from "react";
import colors from "../../styles/colors";

const Reservas = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Todas");

  const [reservations, setReservations] = useState([
    {
      id: "RES-001",
      cliente: "Juan Pérez",
      telefono: "555-0101",
      email: "juan@email.com",
      fecha: "2025-11-09",
      hora: "19:00",
      personas: 4,
      mesa: "Mesa 7",
      estado: "Confirmada",
      notas: "Celebración de aniversario",
    },
    {
      id: "RES-002",
      cliente: "María García",
      telefono: "555-0102",
      email: "maria@email.com",
      fecha: "2025-11-09",
      hora: "20:30",
      personas: 2,
      mesa: "Mesa 15",
      estado: "Confirmada",
      notas: "",
    },
    {
      id: "RES-003",
      cliente: "Carlos López",
      telefono: "555-0103",
      email: "carlos@email.com",
      fecha: "2025-11-10",
      hora: "18:00",
      personas: 6,
      mesa: "Mesa 10",
      estado: "Pendiente",
      notas: "Cena de negocios",
    },
    {
      id: "RES-004",
      cliente: "Ana Martínez",
      telefono: "555-0104",
      email: "ana@email.com",
      fecha: "2025-11-10",
      hora: "21:00",
      personas: 8,
      mesa: "Mesa 18",
      estado: "Confirmada",
      notas: "Cumpleaños, necesitan decoración",
    },
    {
      id: "RES-005",
      cliente: "Pedro Sánchez",
      telefono: "555-0105",
      email: "pedro@email.com",
      fecha: "2025-11-11",
      hora: "19:30",
      personas: 4,
      mesa: "Pendiente",
      estado: "Pendiente",
      notas: "",
    },
  ]);

  const getStatusColor = (estado) => {
    const statusColors = {
      Confirmada: { bg: "#10B98120", color: "#10B981" },
      Pendiente: { bg: "#F59E0B20", color: "#F59E0B" },
      Cancelada: { bg: "#EF444420", color: "#EF4444" },
      Completada: { bg: "#6B728020", color: "#6B7280" },
    };
    return statusColors[estado] || statusColors["Pendiente"];
  };

  const updateReservationStatus = (id, newStatus) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, estado: newStatus } : res
      )
    );
  };

  const ReservationModal = () => (
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
            Nueva Reserva
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
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Nombre del Cliente *
              </label>
              <input
                type="text"
                placeholder="Nombre completo"
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

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="cliente@email.com"
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
                Fecha *
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

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Hora *
              </label>
              <input
                type="time"
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
                Número de Personas *
              </label>
              <input
                type="number"
                min="1"
                placeholder="0"
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
                Mesa Asignada
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  borderColor: colors.secondary + "40",
                  backgroundColor: colors.background,
                }}
              >
                <option value="">Asignar después...</option>
                <option value="Mesa 1">Mesa 1 (4 personas)</option>
                <option value="Mesa 2">Mesa 2 (2 personas)</option>
                <option value="Mesa 7">Mesa 7 (8 personas)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text }}
              >
                Notas / Solicitudes Especiales
              </label>
              <textarea
                rows="3"
                placeholder="Alergias, preferencias de asiento, ocasión especial..."
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
              Crear Reserva
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
            Reservas
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Gestiona las reservaciones del restaurante
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
          Nueva Reserva
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Total Hoy
          </p>
          <p className="text-3xl font-bold" style={{ color: colors.primary }}>
            {reservations.filter((r) => r.fecha === "2025-11-09").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Confirmadas
          </p>
          <p className="text-3xl font-bold" style={{ color: "#10B981" }}>
            {reservations.filter((r) => r.estado === "Confirmada").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Pendientes
          </p>
          <p className="text-3xl font-bold" style={{ color: "#F59E0B" }}>
            {reservations.filter((r) => r.estado === "Pendiente").length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>
            Total Personas
          </p>
          <p className="text-3xl font-bold" style={{ color: colors.accent }}>
            {reservations.reduce((sum, r) => sum + r.personas, 0)}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["Todas", "Hoy", "Mañana", "Esta Semana"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedDate(filter)}
            className="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200"
            style={{
              backgroundColor:
                selectedDate === filter ? colors.accent : "white",
              color: selectedDate === filter ? colors.primary : colors.text,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reservations Table */}
      <div
        className="rounded-xl shadow-md overflow-hidden"
        style={{ backgroundColor: "white" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: colors.primary }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Fecha & Hora
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Personas
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Mesa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const statusColor = getStatusColor(reservation.estado);
                return (
                  <tr
                    key={reservation.id}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "white" : colors.background,
                      borderBottom: `1px solid ${colors.secondary}20`,
                    }}
                  >
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: colors.primary }}
                    >
                      {reservation.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p
                          className="font-medium"
                          style={{ color: colors.primary }}
                        >
                          {reservation.cliente}
                        </p>
                        {reservation.notas && (
                          <p
                            className="text-xs"
                            style={{ color: colors.textSecondary }}
                          >
                            📝 {reservation.notas}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.text }}>
                        <p>📞 {reservation.telefono}</p>
                        {reservation.email && <p>✉️ {reservation.email}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm" style={{ color: colors.text }}>
                        <p className="font-medium">📅 {reservation.fecha}</p>
                        <p>🕐 {reservation.hora}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2"
                        style={{ color: colors.text }}
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
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span className="font-medium">
                          {reservation.personas}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-6 py-4 font-medium"
                      style={{ color: colors.accent }}
                    >
                      {reservation.mesa}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.color,
                        }}
                      >
                        {reservation.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {reservation.estado === "Pendiente" && (
                          <button
                            onClick={() =>
                              updateReservationStatus(
                                reservation.id,
                                "Confirmada"
                              )
                            }
                            className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                            style={{ color: "#10B981" }}
                            title="Confirmar"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        )}
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
                        <button
                          onClick={() =>
                            updateReservationStatus(reservation.id, "Cancelada")
                          }
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          style={{ color: "#EF4444" }}
                          title="Cancelar"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <ReservationModal />}
    </div>
  );
};

export default Reservas;
