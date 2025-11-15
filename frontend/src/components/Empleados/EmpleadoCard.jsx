import { useState } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  UserX,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Briefcase,
} from "lucide-react";
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
  const [showMenu, setShowMenu] = useState(false);
  const statusColor = getStatusColor(employee.activo);

  return (
    <div
      className="rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden bg-white"
      style={{ borderColor: "#E5E7EB" }}
    >
      {/* Header */}
      <div className="p-4 pb-3 border-b" style={{ borderColor: "#F3F4F6" }}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div
              className="text-3xl w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              {getRoleIcon(employee.rol)}
            </div>
            <div>
              <h3 className="font-bold text-primary text-base">
                {employee.nombre} {employee.apellido}
              </h3>
              <div className="flex items-center gap-1 text-xs text-textSecondary mt-0.5">
                <Mail className="w-3 h-3" />
                <span>{employee.email}</span>
              </div>
            </div>
          </div>

          {/* Menú de acciones */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div
                  className="absolute right-0 mt-1 w-44 rounded-lg shadow-lg z-20 py-1 border"
                  style={{ backgroundColor: "white", borderColor: "#E5E7EB" }}
                >
                  <button
                    onClick={() => {
                      onViewDetail(employee);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <Eye className="w-4 h-4" />
                    Ver perfil
                  </button>
                  <button
                    onClick={() => {
                      onEdit(employee);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-textMain"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <hr className="my-1" style={{ borderColor: "#E5E7EB" }} />
                  {employee.activo ? (
                    <button
                      onClick={() => {
                        onDelete(employee);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm"
                    >
                      <UserX className="w-4 h-4" />
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onReactivate(employee);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 text-green-600 flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reactivar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {employee.activo ? "Activo" : "Inactivo"}
          </span>
          <span
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
            style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
          >
            <Briefcase className="w-3 h-3 mr-1" />
            {rolesDisplay[employee.rol]}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Teléfono */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-textSecondary">
            <Phone className="w-4 h-4" />
            <span>Teléfono</span>
          </div>
          <span className="font-medium text-textMain">
            {employee.telefono || "No especificado"}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: "#F3F4F6" }}></div>

        {/* Fecha de registro */}
        <div className="flex items-center gap-1.5 text-xs text-textSecondary">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            Registrado:{" "}
            {new Date(employee.createdAt).toLocaleDateString("es-ES")}
          </span>
        </div>
      </div>

      {/* Footer con botón de acción */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onViewDetail(employee)}
          className="w-full px-4 py-2.5 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#581845" }}
        >
          Ver Perfil Completo
        </button>
      </div>
    </div>
  );
};

export default EmpleadoCard;
