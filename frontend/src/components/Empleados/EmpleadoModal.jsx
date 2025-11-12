import EmpleadoForm from "./EmpleadoForm";
import { rolesDisplay, roles } from "../../utils/empleadosUtils";

/**
 * Modal para crear o editar un empleado
 * Muestra el formulario EmpleadoForm dentro de un modal centrado
 */
const EmpleadoModal = ({ isOpen, employee, onSubmit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">
            {employee ? "Editar Empleado" : "Nuevo Empleado"}
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

        {/* Formulario */}
        <EmpleadoForm
          employee={employee}
          onSubmit={onSubmit}
          onCancel={onClose}
          rolesDisplay={rolesDisplay}
          roles={roles}
        />
      </div>
    </div>
  );
};

export default EmpleadoModal;
