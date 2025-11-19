import { useState, useEffect } from "react";
import { Edit2, X } from "lucide-react";

/**
 * Modal dedicado para editar una ocasión existente
 */
const EditOcasionModal = ({
  isOpen,
  onClose,
  ocasion,
  onSave,
  existingOcasiones = [],
}) => {
  const [editedOcasion, setEditedOcasion] = useState({
    key: "",
    label: "",
    icon: "🎉",
  });
  const [error, setError] = useState("");

  // Iconos disponibles para las ocasiones
  const availableIcons = ["🎉", "🎂", "💐", "💑", "💼", "🎊", "🥂", "🌟"];

  useEffect(() => {
    if (isOpen && ocasion) {
      setEditedOcasion({ ...ocasion });
      setError("");
    }
  }, [isOpen, ocasion]);

  const validateOcasion = () => {
    if (!editedOcasion.key.trim()) {
      setError("La clave de la ocasión es requerida");
      return false;
    }

    if (!editedOcasion.label.trim()) {
      setError("El nombre de la ocasión es requerido");
      return false;
    }

    // Validar que la clave no exista ya (excepto la que estamos editando)
    const keyExists = existingOcasiones.some(
      (o) =>
        o.key.toLowerCase() === editedOcasion.key.toLowerCase() &&
        o.key !== ocasion?.key
    );

    if (keyExists) {
      setError("Ya existe una ocasión con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(editedOcasion.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (!validateOcasion()) return;
    onSave(editedOcasion);
    onClose();
  };

  const handleCancel = () => {
    setEditedOcasion({ ...ocasion });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 60 }}
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Edit2 className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Editar Ocasión</h2>
              <p className="text-sm text-white/80">
                Modifica los detalles de la ocasión
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Clave de la Ocasión *
              </label>
              <input
                type="text"
                value={editedOcasion.key}
                onChange={(e) =>
                  setEditedOcasion({
                    ...editedOcasion,
                    key: e.target.value.toLowerCase(),
                  })
                }
                placeholder="ej: graduacion"
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain ${
                  error && !editedOcasion.key.trim()
                    ? "border-red-500"
                    : "border-secondary/40 focus:border-primary"
                }`}
              />
              <p className="text-xs text-textSecondary mt-1">
                Solo minúsculas y guiones bajos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Nombre de la Ocasión *
              </label>
              <input
                type="text"
                value={editedOcasion.label}
                onChange={(e) =>
                  setEditedOcasion({ ...editedOcasion, label: e.target.value })
                }
                placeholder="ej: Graduación"
                className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain ${
                  error && !editedOcasion.label.trim()
                    ? "border-red-500"
                    : "border-secondary/40 focus:border-primary"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Icono
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditedOcasion({ ...editedOcasion, icon })}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${
                      editedOcasion.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-secondary/40 hover:border-primary/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Guardar Cambios
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2.5 border-2 border-secondary/40 text-textMain rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOcasionModal;
