import { useState, useEffect } from "react";
import { PartyPopper, Plus, X, Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditOcasionModal from "./EditOcasionModal";

/**
 * Modal para gestionar las ocasiones del restaurante
 */
const OcasionesModal = ({
  isOpen,
  onClose,
  currentOcasiones,
  onUpdateOcasiones,
  saving = false,
}) => {
  const [ocasiones, setOcasiones] = useState([]);
  const [initialOcasiones, setInitialOcasiones] = useState([]);
  const [newOcasion, setNewOcasion] = useState({
    key: "",
    label: "",
    icon: "🎉",
  });
  const [editingOcasion, setEditingOcasion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Iconos disponibles para las ocasiones
  const availableIcons = ["🎉", "🎂", "💐", "💑", "💼", "🎊", "🥂", "🌟"];

  useEffect(() => {
    if (isOpen) {
      // Convertir el objeto ocasionesDisplay a array
      const ocasionesArray = Object.entries(currentOcasiones)
        .filter(([key]) => !["ninguna", "otro"].includes(key)) // Excluir predeterminadas
        .map(([key, label]) => ({
          key,
          label,
          icon: getOcasionIcon(key),
        }));
      setOcasiones(ocasionesArray);
      setInitialOcasiones(JSON.parse(JSON.stringify(ocasionesArray)));
      setNewOcasion({ key: "", label: "", icon: "🎉" });
      setEditingOcasion(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
    }
  }, [isOpen, currentOcasiones]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(ocasiones) !== JSON.stringify(initialOcasiones);
      setHasUnsavedChanges(changed);
    }
  }, [ocasiones, initialOcasiones, isOpen]);

  const getOcasionIcon = (ocasion) => {
    const icons = {
      cumpleaños: "🎂",
      aniversario: "💐",
      cita: "💑",
      negocio: "💼",
    };
    return icons[ocasion] || "🎉";
  };

  const validateOcasion = (ocasion) => {
    if (!ocasion.key.trim()) {
      setError("La clave de la ocasión es requerida");
      return false;
    }

    if (!ocasion.label.trim()) {
      setError("El nombre de la ocasión es requerido");
      return false;
    }

    // Validar que la clave no exista ya
    const keyExists = ocasiones.some(
      (o) => o.key.toLowerCase() === ocasion.key.toLowerCase()
    );

    if (keyExists) {
      setError("Ya existe una ocasión con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(ocasion.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleAddOcasion = () => {
    if (!validateOcasion(newOcasion)) return;

    setOcasiones([...ocasiones, { ...newOcasion }]);
    setNewOcasion({ key: "", label: "", icon: "🎉" });
  };

  const handleEditOcasion = (index) => {
    setEditingOcasion({ ...ocasiones[index], index });
    setShowEditModal(true);
  };

  const handleSaveEdit = (editedOcasion) => {
    const updatedOcasiones = [...ocasiones];
    updatedOcasiones[editingOcasion.index] = {
      key: editedOcasion.key,
      label: editedOcasion.label,
      icon: editedOcasion.icon,
    };
    setOcasiones(updatedOcasiones);
    setEditingOcasion(null);
  };

  const handleDeleteOcasion = (index) => {
    setOcasiones(ocasiones.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Convertir array a objeto ocasionesDisplay
    const ocasionesDisplay = ocasiones.reduce((acc, ocasion) => {
      acc[ocasion.key] = ocasion.label;
      return acc;
    }, {});

    // Convertir array a lista de ocasiones
    const ocasionesList = ["ninguna", ...ocasiones.map((o) => o.key), "otro"];

    // Convertir array a iconos
    const ocasionesIcons = ocasiones.reduce((acc, ocasion) => {
      acc[ocasion.key] = ocasion.icon;
      return acc;
    }, {});

    onUpdateOcasiones({
      ocasionesDisplay,
      ocasionesList,
      ocasionesIcons,
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
    setNewOcasion({ key: "", label: "", icon: "🎉" });
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
              <PartyPopper className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Gestionar Ocasiones
              </h3>
              <p className="text-sm text-textSecondary">
                Configura las ocasiones disponibles para reservas
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

        {/* Lista de ocasiones existentes */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Ocasiones Actuales
          </h4>
          <div className="space-y-2">
            {ocasiones.map((ocasion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ocasion.icon}</span>
                  <div>
                    <p className="font-medium text-textMain">{ocasion.label}</p>
                    <p className="text-sm text-textSecondary">{ocasion.key}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOcasion(index)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar ocasión"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteOcasion(index)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar ocasión"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {ocasiones.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <PartyPopper className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay ocasiones configuradas</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario para agregar ocasión */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Agregar Nueva Ocasión
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Clave de la Ocasión *
              </label>
              <input
                type="text"
                value={newOcasion.key}
                onChange={(e) =>
                  setNewOcasion({
                    ...newOcasion,
                    key: e.target.value.toLowerCase(),
                  })
                }
                placeholder="ej: graduacion"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
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
                value={newOcasion.label}
                onChange={(e) =>
                  setNewOcasion({ ...newOcasion, label: e.target.value })
                }
                placeholder="ej: Graduación"
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
                    onClick={() => setNewOcasion({ ...newOcasion, icon })}
                    className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                      newOcasion.icon === icon
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
              onClick={handleAddOcasion}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Ocasión
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
      <EditOcasionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ocasion={editingOcasion}
        onSave={handleSaveEdit}
        existingOcasiones={ocasiones}
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

export default OcasionesModal;
