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

  // Si no hay reservas, no renderizar nada (el mensaje se maneja en el componente padre)
  if (!reservas || reservas.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Hora
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Teléfono
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Personas
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Mesa
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Ocasión
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/20">
            {reservas.map((reserva, index) => {
              const estadoColor = getEstadoColor(reserva.estado);
              const ocasionIcon = getOcasionIcon(reserva.ocasion);
              const esReservaHoy = esHoy(reserva.fecha);
              const esReservaMañana = esMañana(reserva.fecha);

              return (
                <tr
                  key={reserva._id || `reserva-${index}`}
                  style={{
                    backgroundColor: esReservaHoy
                      ? "rgba(16, 185, 129, 0.05)"
                      : esReservaMañana
                      ? "rgba(245, 158, 11, 0.05)"
                      : "#ffffff",
                  }}
                  className="hover:bg-background/50 transition-colors"
                >
                  {/* Fecha */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
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
                  <td className="px-6 py-4">
                    <span className="font-bold text-primary">
                      {formatearHora(reserva.hora)}
                    </span>
                  </td>

                  {/* Cliente */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
                        {reserva.nombreCliente}
                      </span>
                      {reserva.emailCliente && (
                        <span className="text-xs text-textSecondary">
                          {reserva.emailCliente}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Teléfono */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-textMain">
                      {reserva.telefonoCliente}
                    </span>
                  </td>

                  {/* Personas */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-primary">
                      {reserva.numeroPersonas}
                    </span>
                  </td>

                  {/* Mesa */}
                  <td className="px-6 py-4">
                    {reserva.mesaAsignada ? (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} style={{ color: "#3b82f6" }} />
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
                        className="text-sm px-3 py-1 rounded-lg transition-colors hover:bg-amber-100"
                        style={{
                          color: "#f59e0b",
                          backgroundColor: "rgba(245, 158, 11, 0.1)",
                        }}
                      >
                        Asignar
                      </button>
                    )}
                  </td>

                  {/* Ocasión */}
                  <td className="px-6 py-4">
                    <span className="text-2xl">{ocasionIcon}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium inline-block"
                      style={{
                        backgroundColor: `${estadoColor}20`,
                        color: estadoColor,
                      }}
                    >
                      {getEstadoLabel(reserva.estado)}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onViewDetail(reserva)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
                        title="Ver detalle"
                      >
                        <Eye size={18} />
                      </button>

                      {(reserva.estado === "pendiente" ||
                        reserva.estado === "confirmada") && (
                        <>
                          <button
                            onClick={() => onEdit(reserva)}
                            className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            onClick={() => onDelete(reserva)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
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
