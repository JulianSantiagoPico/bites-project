import { X, Users } from "lucide-react";
import EmpleadoForm from "./EmpleadoForm";
import { getAvailableRolesForEmployees } from "../../utils/empleadosUtils";

/**
 * Modal para crear o editar un empleado
 * Muestra el formulario EmpleadoForm dentro de un modal centrado
 */
const EmpleadoModal = ({ isOpen, employee, onSubmit, onClose }) => {
  // Obtener roles disponibles (excluye admin)
  const { rolesDisplay, rolesIcons } = getAvailableRolesForEmployees();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            {employee ? "Editar Empleado" : "Nuevo Empleado"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <EmpleadoForm
            employee={employee}
            onSubmit={onSubmit}
            onCancel={onClose}
            rolesDisplay={rolesDisplay}
            rolesIcons={rolesIcons}
          />
        </div>
      </div>
    </div>
  );
};

export default EmpleadoModal;
