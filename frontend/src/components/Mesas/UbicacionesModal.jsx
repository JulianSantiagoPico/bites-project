import { useState, useEffect } from "react";
import { MapPin, Plus, X, Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditUbicacionModal from "./EditUbicacionModal";

/**
 * Modal para gestionar las ubicaciones del restaurante
 */
const UbicacionesModal = ({
  isOpen,
  onClose,
  currentUbicaciones,
  onUpdateUbicaciones,
  saving = false,
}) => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [initialUbicaciones, setInitialUbicaciones] = useState([]);
  const [newUbicacion, setNewUbicacion] = useState({
    key: "",
    label: "",
    icon: "📍",
  });
  const [editingUbicacion, setEditingUbicacion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Iconos disponibles para las ubicaciones
  const availableIcons = ["📍", "🪟", "🏞️", "🚪", "🌳", "🏛️", "🎭", "🎪"];

  useEffect(() => {
    if (isOpen) {
      // Convertir el objeto ubicacionesDisplay a array
      const ubicacionesArray = Object.entries(currentUbicaciones)
        .filter(
          ([key]) =>
            !["interior", "exterior", "terraza", "barra", "privado"].includes(
              key
            )
        ) // Excluir predeterminadas
        .map(([key, label]) => ({
          key,
          label,
          icon: getUbicacionIcon(key),
        }));
      setUbicaciones(ubicacionesArray);
      setInitialUbicaciones(JSON.parse(JSON.stringify(ubicacionesArray)));
      setNewUbicacion({ key: "", label: "", icon: "📍" });
      setEditingUbicacion(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
    }
  }, [isOpen, currentUbicaciones]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(ubicaciones) !== JSON.stringify(initialUbicaciones);
      setHasUnsavedChanges(changed);
    }
  }, [ubicaciones, initialUbicaciones, isOpen]);

  const getUbicacionIcon = (ubicacion) => {
    const icons = {
      interior: "🏠",
      exterior: "🌳",
      terraza: "☀️",
      barra: "🍺",
      privado: "🔒",
    };
    return icons[ubicacion] || "📍";
  };

  const validateUbicacion = (ubicacion) => {
    if (!ubicacion.key.trim()) {
      setError("La clave de la ubicación es requerida");
      return false;
    }

    if (!ubicacion.label.trim()) {
      setError("El nombre de la ubicación es requerido");
      return false;
    }

    // Validar que la clave no exista ya
    const keyExists = ubicaciones.some(
      (u) => u.key.toLowerCase() === ubicacion.key.toLowerCase()
    );

    if (keyExists) {
      setError("Ya existe una ubicación con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(ubicacion.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleAddUbicacion = () => {
    if (!validateUbicacion(newUbicacion)) return;

    setUbicaciones([...ubicaciones, { ...newUbicacion }]);
    setNewUbicacion({ key: "", label: "", icon: "📍" });
  };

  const handleEditUbicacion = (index) => {
    setEditingUbicacion({ ...ubicaciones[index], index });
    setShowEditModal(true);
  };

  const handleSaveEdit = (editedUbicacion) => {
    const updatedUbicaciones = [...ubicaciones];
    updatedUbicaciones[editingUbicacion.index] = {
      key: editedUbicacion.key,
      label: editedUbicacion.label,
      icon: editedUbicacion.icon,
    };
    setUbicaciones(updatedUbicaciones);
    setEditingUbicacion(null);
  };

  const handleDeleteUbicacion = (index) => {
    setUbicaciones(ubicaciones.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Convertir array a objeto ubicacionesDisplay
    const ubicacionesDisplay = ubicaciones.reduce((acc, ubicacion) => {
      acc[ubicacion.key] = ubicacion.label;
      return acc;
    }, {});

    // Convertir array a lista de ubicaciones
    const ubicacionesList = [
      "interior",
      "exterior",
      "terraza",
      "barra",
      "privado",
      ...ubicaciones.map((u) => u.key),
    ];

    // Convertir array a iconos
    const ubicacionesIcons = ubicaciones.reduce((acc, ubicacion) => {
      acc[ubicacion.key] = ubicacion.icon;
      return acc;
    }, {});

    onUpdateUbicaciones({
      ubicacionesDisplay,
      ubicacionesList,
      ubicacionesIcons,
    });

    setHasUnsavedChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
      return;
    }
    onClose();
  };

  const confirmClose = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleClearForm = () => {
    setNewUbicacion({ key: "", label: "", icon: "📍" });
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className="rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Gestionar Ubicaciones
              </h3>
              <p className="text-sm text-textSecondary">
                Configura las ubicaciones disponibles para mesas
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de ubicaciones existentes */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Ubicaciones Actuales
          </h4>
          <div className="space-y-2">
            {ubicaciones.map((ubicacion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ubicacion.icon}</span>
                  <div>
                    <p className="font-medium text-textMain">
                      {ubicacion.label}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {ubicacion.key}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUbicacion(index)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar ubicación"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUbicacion(index)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar ubicación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {ubicaciones.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay ubicaciones configuradas</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario para agregar ubicación */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Agregar Nueva Ubicación
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Clave de la Ubicación *
              </label>
              <input
                type="text"
                value={newUbicacion.key}
                onChange={(e) =>
                  setNewUbicacion({
                    ...newUbicacion,
                    key: e.target.value.toLowerCase(),
                  })
                }
                placeholder="ej: jardin"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
              />
              <p className="text-xs text-textSecondary mt-1">
                Solo minúsculas y guiones bajos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Nombre de la Ubicación *
              </label>
              <input
                type="text"
                value={newUbicacion.label}
                onChange={(e) =>
                  setNewUbicacion({ ...newUbicacion, label: e.target.value })
                }
                placeholder="ej: Jardín"
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
                    onClick={() => setNewUbicacion({ ...newUbicacion, icon })}
                    className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                      newUbicacion.icon === icon
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

          <div className="flex gap-2">
            <button
              onClick={handleAddUbicacion}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Ubicación
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-success text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-6 py-3 border-2 border-secondary/40 text-textMain rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      <EditUbicacionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ubicacion={editingUbicacion}
        onSave={handleSaveEdit}
        existingUbicaciones={ubicaciones}
      />

      {/* Diálogo de confirmación */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmClose}
        title="Cambios sin guardar"
        message="Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
        confirmText="Salir sin guardar"
        cancelText="Continuar editando"
        type="warning"
      />
    </div>
  );
};

export default UbicacionesModal;
