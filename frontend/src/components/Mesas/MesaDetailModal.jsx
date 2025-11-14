import {
  getEstadoColor,
  getUbicacionIcon,
  formatEstado,
  getMeseroNombre,
  formatCapacidad,
} from "../../utils/mesasUtils";

const MesaDetailModal = ({ mesa, isOpen, onClose, onEdit }) => {
  if (!isOpen || !mesa) return null;

  const estadoColor = getEstadoColor(mesa.estado);
  const ubicacionIcon = getUbicacionIcon(mesa.ubicacion);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="text-5xl w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              {ubicacionIcon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Mesa #{mesa.numero}
              </h3>
              <span
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: estadoColor.bgColor,
                  color: estadoColor.color,
                }}
              >
                {formatEstado(mesa.estado)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
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

        {/* Body */}
        <div className="space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span>ℹ️</span>
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#F9FAFB" }}
              >
                <p className="text-sm text-textSecondary mb-1">Capacidad</p>
                <p className="text-lg font-semibold text-textMain flex items-center gap-2">
                  <span>👥</span>
                  {formatCapacidad(mesa.capacidad)}
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#F9FAFB" }}
              >
                <p className="text-sm text-textSecondary mb-1">Ubicación</p>
                <p className="text-lg font-semibold text-textMain flex items-center gap-2">
                  <span>{ubicacionIcon}</span>
                  {mesa.ubicacion}
                </p>
              </div>
            </div>
          </div>

          {/* Mesero Asignado */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span>👤</span>
              Mesero Asignado
            </h3>
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              {mesa.meseroAsignado ? (
                <div>
                  <p className="text-lg font-semibold text-textMain">
                    {getMeseroNombre(mesa.meseroAsignado)}
                  </p>
                  {mesa.meseroAsignado.email && (
                    <p className="text-sm text-textSecondary mt-1">
                      📧 {mesa.meseroAsignado.email}
                    </p>
                  )}
                  {mesa.meseroAsignado.telefono && (
                    <p className="text-sm text-textSecondary">
                      📱 {mesa.meseroAsignado.telefono}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-textSecondary italic">Sin mesero asignado</p>
              )}
            </div>
          </div>

          {/* Notas */}
          {mesa.notas && (
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                <span>📝</span>
                Notas
              </h3>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#F9FAFB" }}
              >
                <p className="text-textMain">{mesa.notas}</p>
              </div>
            </div>
          )}

          {/* Información de Auditoría */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
              <span>📅</span>
              Información del Sistema
            </h3>
            <div
              className="p-4 rounded-lg space-y-2"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <div className="flex justify-between">
                <span className="text-sm text-textSecondary">
                  Fecha de creación:
                </span>
                <span className="text-sm font-medium text-textMain">
                  {formatDate(mesa.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-textSecondary">
                  Última actualización:
                </span>
                <span className="text-sm font-medium text-textMain">
                  {formatDate(mesa.updatedAt)}
                </span>
              </div>
              {mesa.creadoPor && (
                <div className="flex justify-between">
                  <span className="text-sm text-textSecondary">
                    Creado por:
                  </span>
                  <span className="text-sm font-medium text-textMain">
                    {mesa.creadoPor.nombre} {mesa.creadoPor.apellido}
                  </span>
                </div>
              )}
              {mesa.modificadoPor && (
                <div className="flex justify-between">
                  <span className="text-sm text-textSecondary">
                    Modificado por:
                  </span>
                  <span className="text-sm font-medium text-textMain">
                    {mesa.modificadoPor.nombre} {mesa.modificadoPor.apellido}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-textSecondary">Estado:</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: mesa.activo ? "#10B981" : "#EF4444" }}
                >
                  {mesa.activo ? "Activa" : "Inactiva"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex gap-3 pt-6 border-t"
          style={{ borderColor: "#E5E7EB" }}
        >
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity bg-gray-100 text-textMain"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onEdit(mesa);
              onClose();
            }}
            className="flex-1 px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
          >
            Editar Mesa
          </button>
        </div>
      </div>
    </div>
  );
};

export default MesaDetailModal;
