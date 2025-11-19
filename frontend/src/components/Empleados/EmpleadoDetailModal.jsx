import {
  getStatusColor,
  getRoleIcon,
  formatDate,
  getCurrentRoles,
} from "../../utils/empleadosUtils";
import { User, X } from "lucide-react";
import PermissionButton from "../PermissionButton";
import { PERMISSIONS } from "../../utils/permissions";

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

  const { rolesDisplay } = getCurrentRoles();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="sticky top-0 z-10 bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil del Empleado
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-textSecondary mb-1">Email</p>
              <p className="font-medium text-textMain">{employee.email}</p>
            </div>

            {/* Teléfono */}
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-textSecondary mb-1">Teléfono</p>
              <p className="font-medium text-textMain">
                {employee.telefono || "No especificado"}
              </p>
            </div>

            {/* Fecha de Ingreso */}
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-textSecondary mb-1">
                Fecha de Ingreso
              </p>
              <p className="font-medium text-textMain">
                {formatDate(employee.createdAt)}
              </p>
            </div>

            {/* Estado */}
            <div className="p-4 rounded-lg bg-gray-50">
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
              <div className="p-4 rounded-lg bg-gray-50 md:col-span-2">
                <p className="text-sm text-textSecondary mb-1">Último Acceso</p>
                <p className="font-medium text-textMain">
                  {formatDate(employee.ultimoAcceso)}
                </p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            {employee.rol !== "admin" ? (
              <>
                <PermissionButton
                  permission={PERMISSIONS.EMPLEADOS.UPDATE}
                  onClick={() => {
                    onClose();
                    onEdit(employee);
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Editar
                </PermissionButton>
                {employee.activo ? (
                  <PermissionButton
                    permission={PERMISSIONS.EMPLEADOS.DELETE}
                    onClick={() => {
                      onClose();
                      onDelete(employee);
                    }}
                    variant="danger"
                    className="flex-1"
                  >
                    Desactivar
                  </PermissionButton>
                ) : (
                  <PermissionButton
                    permission={PERMISSIONS.EMPLEADOS.UPDATE}
                    onClick={() => {
                      onClose();
                      onReactivate(employee);
                    }}
                    variant="success"
                    className="flex-1"
                  >
                    Reactivar
                  </PermissionButton>
                )}
              </>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetailModal;
