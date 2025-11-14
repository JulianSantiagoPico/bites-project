import { Eye, Edit2, Trash2, MapPin } from "lucide-react";
import {
  formatearFechaCorta,
  formatearHora,
  getEstadoColor,
  getEstadoLabel,
  getOcasionIcon,
  esHoy,
  esMañana,
} from "../../utils/reservasUtils";

/**
 * Componente de tabla para mostrar reservas
 */
const ReservasTable = ({
  reservas,
  onViewDetail,
  onEdit,
  onDelete,
  onChangeEstado,
  onAsignarMesa,
}) => {
  const textMain = "#1f2937";
  const textSecondary = "#6b7280";

  if (!reservas || reservas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p style={{ color: textSecondary }} className="text-lg">
          No hay reservas para mostrar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Fecha
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Hora
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Cliente
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Teléfono
              </th>
              <th
                className="px-4 py-3 text-center text-sm font-semibold"
                style={{ color: textMain }}
              >
                Personas
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Mesa
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold"
                style={{ color: textMain }}
              >
                Ocasión
              </th>
              <th
                className="px-4 py-3 text-center text-sm font-semibold"
                style={{ color: textMain }}
              >
                Estado
              </th>
              <th
                className="px-4 py-3 text-center text-sm font-semibold"
                style={{ color: textMain }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva, index) => {
              const estadoColor = getEstadoColor(reserva.estado);
              const ocasionIcon = getOcasionIcon(reserva.ocasion);
              const esReservaHoy = esHoy(reserva.fecha);
              const esReservaMañana = esMañana(reserva.fecha);

              return (
                <tr
                  key={reserva._id || `reserva-${index}`}
                  style={{
                    borderBottom:
                      index < reservas.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    backgroundColor: esReservaHoy
                      ? "rgba(16, 185, 129, 0.05)"
                      : esReservaMañana
                      ? "rgba(245, 158, 11, 0.05)"
                      : "#ffffff",
                  }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Fecha */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium" style={{ color: textMain }}>
                        {formatearFechaCorta(reserva.fecha)}
                      </span>
                      {esReservaHoy && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#10b981" }}
                        >
                          Hoy
                        </span>
                      )}
                      {esReservaMañana && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#f59e0b" }}
                        >
                          Mañana
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Hora */}
                  <td className="px-4 py-3">
                    <span className="font-medium" style={{ color: textMain }}>
                      {formatearHora(reserva.hora)}
                    </span>
                  </td>

                  {/* Cliente */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium" style={{ color: textMain }}>
                        {reserva.nombreCliente}
                      </span>
                      {reserva.emailCliente && (
                        <span
                          className="text-xs"
                          style={{ color: textSecondary }}
                        >
                          {reserva.emailCliente}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Teléfono */}
                  <td className="px-4 py-3">
                    <span style={{ color: textSecondary }}>
                      {reserva.telefonoCliente}
                    </span>
                  </td>

                  {/* Personas */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold" style={{ color: textMain }}>
                      {reserva.numeroPersonas}
                    </span>
                  </td>

                  {/* Mesa */}
                  <td className="px-4 py-3">
                    {reserva.mesaAsignada ? (
                      <div className="flex items-center gap-1">
                        <MapPin size={14} style={{ color: "#3b82f6" }} />
                        <span
                          className="font-medium"
                          style={{ color: "#3b82f6" }}
                        >
                          Mesa {reserva.mesaAsignada.numero}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAsignarMesa(reserva)}
                        className="text-sm px-2 py-1 rounded transition-colors"
                        style={{
                          color: "#f59e0b",
                          backgroundColor: "rgba(245, 158, 11, 0.1)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(245, 158, 11, 0.2)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(245, 158, 11, 0.1)";
                        }}
                      >
                        Asignar
                      </button>
                    )}
                  </td>

                  {/* Ocasión */}
                  <td className="px-4 py-3">
                    <span className="text-lg">{ocasionIcon}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${estadoColor}20`,
                        color: estadoColor,
                      }}
                    >
                      {getEstadoLabel(reserva.estado)}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetail(reserva)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: "#3b82f6" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(59, 130, 246, 0.1)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </button>

                      {(reserva.estado === "pendiente" ||
                        reserva.estado === "confirmada") && (
                        <>
                          <button
                            onClick={() => onEdit(reserva)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#10b981" }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(16, 185, 129, 0.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            onClick={() => onDelete(reserva)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: "#ef4444" }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(239, 68, 68, 0.1)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservasTable;
