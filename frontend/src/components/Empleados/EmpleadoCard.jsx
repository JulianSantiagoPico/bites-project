import {
  getStatusColor,
  getRoleIcon,
  rolesDisplay,
} from "../../utils/empleadosUtils";

/**
 * Componente de tarjeta individual para mostrar información de un empleado
 * Incluye: Avatar, nombre, email, rol, teléfono, estado y acciones
 */
const EmpleadoCard = ({
  employee,
  onViewDetail,
  onEdit,
  onDelete,
  onReactivate,
}) => {
  const statusColor = getStatusColor(employee.activo);

  return (
    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      {/* Header con avatar y datos principales */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl w-16 h-16 rounded-full flex items-center justify-center bg-background">
            {getRoleIcon(employee.rol)}
          </div>
          <div>
            <h3 className="font-bold text-primary">
              {employee.nombre} {employee.apellido}
            </h3>
            <p className="text-sm text-textSecondary">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* Información del empleado */}
      <div className="space-y-3">
        {/* Rol */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Rol</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
            {rolesDisplay[employee.rol]}
          </span>
        </div>

        {/* Teléfono */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Teléfono</span>
          <span className="text-sm font-medium text-textMain">
            {employee.telefono || "No especificado"}
          </span>
        </div>

        {/* Estado */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Estado</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {employee.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Fecha de registro */}
        <div className="pt-3 mt-3 border-t border-secondary/20">
          <div className="text-xs text-textSecondary">
            <p>
              📅 Registrado:{" "}
              {new Date(employee.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        {/* Ver perfil */}
        <button
          onClick={() => onViewDetail(employee)}
          className="flex-1 py-2 rounded-lg font-medium border-2 hover:bg-blue-50 transition-colors text-sm border-secondary/40 text-primary"
        >
          Ver Perfil
        </button>

        {/* Editar */}
        <button
          onClick={() => onEdit(employee)}
          className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#3B82F6]"
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

        {/* Desactivar / Reactivar */}
        {employee.activo ? (
          <button
            onClick={() => onDelete(employee)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
            title="Desactivar"
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => onReactivate(employee)}
            className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-500"
            title="Reactivar"
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmpleadoCard;
