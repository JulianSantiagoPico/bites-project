import { useState, useEffect } from "react";
import { Edit2, X } from "lucide-react";

/**
 * Modal dedicado para editar una categoría existente
 */
const EditCategoriaModal = ({
  isOpen,
  onClose,
  categoria,
  onSave,
  existingCategorias = [],
}) => {
  const [editedCategoria, setEditedCategoria] = useState({
    key: "",
    label: "",
    icon: "🍽️",
  });
  const [error, setError] = useState("");

  // Iconos disponibles para las categorías
  const availableIcons = ["🍽️", "🍕", "🍔", "🥗", "🍜", "🍰", "☕", "🍹"];

  useEffect(() => {
    if (isOpen && categoria) {
      setEditedCategoria({ ...categoria });
      setError("");
    }
  }, [isOpen, categoria]);

  const validateCategoria = () => {
    if (!editedCategoria.key.trim()) {
      setError("La clave de la categoría es requerida");
      return false;
    }

    if (!editedCategoria.label.trim()) {
      setError("El nombre de la categoría es requerido");
      return false;
    }

    // Validar que la clave no exista ya (excepto la que estamos editando)
    const keyExists = existingCategorias.some(
      (c) =>
        c.key.toLowerCase() === editedCategoria.key.toLowerCase() &&
        c.key !== categoria?.key
    );

    if (keyExists) {
      setError("Ya existe una categoría con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(editedCategoria.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (!validateCategoria()) return;
    onSave(editedCategoria);
    onClose();
  };

  const handleCancel = () => {
    setEditedCategoria({ ...categoria });
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
              <h2 className="text-xl font-bold text-white">Editar Categoría</h2>
              <p className="text-sm text-white/80">
                Modifica los detalles de la categoría
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
                Clave de la Categoría *
              </label>
              <input
                type="text"
                value={editedCategoria.key}
                onChange={(e) =>
                  setEditedCategoria({
                    ...editedCategoria,
                    key: e.target.value.toLowerCase(),
                  })
                }
                placeholder="ej: ensaladas"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
              />
              <p className="text-xs text-textSecondary mt-1">
                Solo minúsculas y guiones bajos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={editedCategoria.label}
                onChange={(e) =>
                  setEditedCategoria({
                    ...editedCategoria,
                    label: e.target.value,
                  })
                }
                placeholder="ej: Ensaladas"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
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
                    onClick={(e) => {
                      e.preventDefault();
                      setEditedCategoria((prev) => ({ ...prev, icon }));
                    }}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-105 ${
                      editedCategoria.icon === icon
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
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

export default EditCategoriaModal;
