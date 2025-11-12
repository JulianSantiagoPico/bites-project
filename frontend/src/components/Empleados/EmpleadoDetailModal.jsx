import {
  getStatusColor,
  getRoleIcon,
  formatDate,
  rolesDisplay,
} from "../../utils/empleadosUtils";

/**
 * Modal para mostrar el detalle completo de un empleado
 * Incluye: Información personal, estado, fechas y acciones
 */
const EmpleadoDetailModal = ({
  isOpen,
  employee,
  onClose,
  onEdit,
  onDelete,
  onReactivate,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">
            Perfil del Empleado
          </h3>
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

        <div className="space-y-6">
          {/* Avatar y nombre */}
          <div className="flex items-center gap-4 pb-6 border-b border-secondary/20">
            <div className="text-6xl w-20 h-20 rounded-full flex items-center justify-center bg-background">
              {getRoleIcon(employee.rol)}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary">
                {employee.nombre} {employee.apellido}
              </h4>
              <p className="text-textSecondary">{rolesDisplay[employee.rol]}</p>
            </div>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm text-textSecondary mb-1">Email</p>
              <p className="font-medium text-textMain">{employee.email}</p>
            </div>

            {/* Teléfono */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm text-textSecondary mb-1">Teléfono</p>
              <p className="font-medium text-textMain">
                {employee.telefono || "No especificado"}
              </p>
            </div>

            {/* Fecha de Ingreso */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm text-textSecondary mb-1">
                Fecha de Ingreso
              </p>
              <p className="font-medium text-textMain">
                {formatDate(employee.createdAt)}
              </p>
            </div>

            {/* Estado */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm text-textSecondary mb-1">Estado</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                  getStatusColor(employee.activo).bg
                } ${getStatusColor(employee.activo).text}`}
              >
                {employee.activo ? "Activo" : "Inactivo"}
              </span>
            </div>

            {/* Último Acceso (opcional) */}
            {employee.ultimoAcceso && (
              <div className="p-4 rounded-lg bg-background md:col-span-2">
                <p className="text-sm text-textSecondary mb-1">Último Acceso</p>
                <p className="font-medium text-textMain">
                  {formatDate(employee.ultimoAcceso)}
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Editar
            </button>
            {employee.activo ? (
              <button
                onClick={() => {
                  onClose();
                  onDelete(employee);
                }}
                className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-red-500"
              >
                Desactivar
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onReactivate(employee);
                }}
                className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-green-500"
              >
                Reactivar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetailModal;
