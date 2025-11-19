import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  MapPin,
  FileText,
  Gift,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  formatearFecha,
  formatearHora,
  getEstadoColor,
  getEstadoLabel,
  getEstadosDisponibles,
  getOcasionLabel,
  getOcasionIcon,
  puedeEditarReserva,
} from "../../utils/reservasUtils";

/**
 * Modal de detalle de reserva
 */
const ReservaDetailModal = ({
  isOpen,
  reserva,
  onClose,
  onEdit,
  onDelete,
  onChangeEstado,
  onAsignarMesa,
}) => {
  if (!isOpen || !reserva) return null;

  const textMain = "#1f2937";
  const textSecondary = "#6b7280";
  const estadoColor = getEstadoColor(reserva.estado);
  const ocasionIcon = getOcasionIcon(reserva.ocasion);
  const estadosDisponibles = getEstadosDisponibles(reserva.estado);
  const puedeEditar = puedeEditarReserva(reserva.estado);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="sticky top-0 z-10 bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Detalle de Reserva
              </h2>
              <p className="text-sm text-white/80">{reserva.nombreCliente}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Estado */}
          <div>
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${estadoColor}20`,
                color: estadoColor,
              }}
            >
              {getEstadoLabel(reserva.estado)}
            </span>
          </div>

          {/* Información del Cliente */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: textMain }}>
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User size={20} style={{ color: "#3b82f6" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Nombre
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {reserva.nombreCliente}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={20} style={{ color: "#10b981" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Teléfono
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {reserva.telefonoCliente}
                  </p>
                </div>
              </div>

              {reserva.emailCliente && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <Mail size={20} style={{ color: "#f59e0b" }} />
                  <div>
                    <p className="text-xs" style={{ color: textSecondary }}>
                      Email
                    </p>
                    <p className="font-medium" style={{ color: textMain }}>
                      {reserva.emailCliente}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalles de la Reserva */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold" style={{ color: textMain }}>
              Detalles de la Reserva
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar size={20} style={{ color: "#8b5cf6" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Fecha
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {formatearFecha(reserva.fecha)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock size={20} style={{ color: "#06b6d4" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Hora
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {formatearHora(reserva.hora)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users size={20} style={{ color: "#ec4899" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Número de Personas
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {reserva.numeroPersonas}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Gift size={20} style={{ color: "#f59e0b" }} />
                <div>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Ocasión
                  </p>
                  <p className="font-medium" style={{ color: textMain }}>
                    {ocasionIcon} {getOcasionLabel(reserva.ocasion)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <MapPin size={20} style={{ color: "#3b82f6" }} />
                <div className="flex-1">
                  <p className="text-xs" style={{ color: textSecondary }}>
                    Mesa Asignada
                  </p>
                  {reserva.mesaAsignada ? (
                    <div className="flex items-center justify-between">
                      <p className="font-medium" style={{ color: textMain }}>
                        Mesa {reserva.mesaAsignada.numero} - Capacidad:{" "}
                        {reserva.mesaAsignada.capacidad}
                      </p>
                      <button
                        onClick={() => onAsignarMesa(reserva)}
                        className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{
                          color: "#7c3aed",
                          backgroundColor: "rgba(124, 58, 237, 0.1)",
                        }}
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAsignarMesa(reserva)}
                      className="text-sm px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80 mt-1"
                      style={{
                        color: "#7c3aed",
                        backgroundColor: "rgba(124, 58, 237, 0.1)",
                      }}
                    >
                      Asignar Mesa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          {reserva.notas && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={18} style={{ color: textMain }} />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: textMain }}
                >
                  Notas
                </h3>
              </div>
              <p
                className="p-3 bg-gray-50 rounded-lg"
                style={{ color: textSecondary }}
              >
                {reserva.notas}
              </p>
            </div>
          )}

          {/* Cambiar Estado */}
          {estadosDisponibles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold" style={{ color: textMain }}>
                Cambiar Estado
              </h3>
              <div className="flex flex-wrap gap-2">
                {estadosDisponibles.map((estado) => {
                  const estadoColor = getEstadoColor(estado.value);
                  return (
                    <button
                      key={estado.value}
                      onClick={() => onChangeEstado(reserva, estado.value)}
                      className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90 hover:shadow-md"
                      style={{
                        color: estadoColor,
                        backgroundColor: `${estadoColor}15`,
                        border: `1.5px solid ${estadoColor}40`,
                      }}
                    >
                      {estado.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 px-6 py-4 border-t flex items-center justify-between"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium transition-all hover:bg-gray-100 border border-gray-200"
            style={{
              color: textSecondary,
              backgroundColor: "#ffffff",
            }}
          >
            Cerrar
          </button>

          {puedeEditar && (
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(reserva)}
                className="px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 flex items-center gap-2"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#7c3aed",
                }}
              >
                <Edit2 size={18} />
                Editar
              </button>

              <button
                onClick={() => onDelete(reserva)}
                className="px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 flex items-center gap-2"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#f87171",
                }}
              >
                <Trash2 size={18} />
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaDetailModal;
