import { useState, useEffect } from "react";
import {
  PartyPopper,
  Plus,
  X,
  Trash2,
  Edit2,
  List,
  FolderPlus,
} from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditOcasionModal from "./EditOcasionModal";

/**
 * Modal para gestionar las ocasiones del restaurante
 */
const OcasionesModal = ({
  isOpen,
  onClose,
  currentOcasiones,
  currentIcons = {},
  onUpdateOcasiones,
  saving = false,
}) => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' o 'add'
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

  // Función helper para obtener icono por defecto de una ocasión
  const getOcasionIcon = (ocasion) => {
    const icons = {
      cumpleaños: "🎂",
      aniversario: "💐",
      cita: "💑",
      negocio: "💼",
    };
    return icons[ocasion] || "🎉";
  };

  useEffect(() => {
    if (isOpen) {
      // Validar que currentOcasiones sea un objeto válido
      if (
        !currentOcasiones ||
        typeof currentOcasiones !== "object" ||
        Array.isArray(currentOcasiones)
      ) {
        console.error(
          "currentOcasiones no es un objeto válido:",
          currentOcasiones
        );
        setOcasiones([]);
        setInitialOcasiones([]);
        return;
      }

      // Convertir el objeto ocasionesDisplay a array
      const ocasionesArray = Object.entries(currentOcasiones)
        .filter(([key, label]) => {
          // Excluir "ninguna" y "otro"
          if (["ninguna", "otro"].includes(key)) {
            return false;
          }
          // Filtrar propiedades de Mongoose (empiezan con $ o _)
          if (key.startsWith("$") || key.startsWith("_")) {
            return false;
          }
          // Validar que key sea string y label sea string
          return (
            typeof key === "string" &&
            (typeof label === "string" || typeof label === "number")
          );
        })
        .map(([key, label]) => ({
          key: String(key),
          label: String(label),
          icon:
            currentIcons && currentIcons[key]
              ? String(currentIcons[key])
              : getOcasionIcon(key),
        }));

      setOcasiones(ocasionesArray);
      setInitialOcasiones(JSON.parse(JSON.stringify(ocasionesArray)));
      setNewOcasion({ key: "", label: "", icon: "🎉" });
      setEditingOcasion(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
      setActiveTab("list"); // Resetear a la pestaña de lista
    }
  }, [isOpen, currentOcasiones, currentIcons]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(ocasiones) !== JSON.stringify(initialOcasiones);
      setHasUnsavedChanges(changed);
    }
  }, [ocasiones, isOpen]); // Removido initialOcasiones de las dependencias

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
    setError("");
    // Cambiar a la pestaña de lista para ver la ocasión agregada
    setActiveTab("list");
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
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título morado y línea divisora */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PartyPopper className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Gestionar Ocasiones
              </h2>
              <p className="text-sm text-white/80">
                Configura las ocasiones disponibles para reservas
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-secondary/20">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
                activeTab === "list"
                  ? "text-primary"
                  : "text-textSecondary hover:text-textMain"
              }`}
            >
              <List className="w-5 h-5" />
              Ocasiones
              {ocasiones.length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "list"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {ocasiones.length}
                </span>
              )}
              {activeTab === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("add");
                setError("");
              }}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
                activeTab === "add"
                  ? "text-primary"
                  : "text-textSecondary hover:text-textMain"
              }`}
            >
              <FolderPlus className="w-5 h-5" />
              Agregar Ocasión
              {activeTab === "add" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto mb-6">
            {/* Tab: Lista de Ocasiones */}
            {activeTab === "list" && (
              <div className="space-y-2">
                {ocasiones.length === 0 ? (
                  <div className="text-center py-12 text-textSecondary bg-white rounded-lg border-2 border-dashed border-secondary/40">
                    <PartyPopper className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium mb-1">No hay ocasiones</p>
                    <p className="text-sm mb-4">
                      Comienza agregando tu primera ocasión especial
                    </p>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Ocasión
                    </button>
                  </div>
                ) : (
                  <>
                    {ocasiones.map((ocasion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-secondary/40 hover:border-primary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl bg-background rounded-lg p-2">
                            {ocasion.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-textMain text-lg">
                              {ocasion.label}
                            </p>
                            <p className="text-sm text-textSecondary font-mono">
                              {ocasion.key}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditOcasion(index)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Editar ocasión"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOcasion(index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Eliminar ocasión"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Tab: Agregar Ocasión */}
            {activeTab === "add" && (
              <div className="bg-white rounded-lg p-6 border-2 border-secondary/40">
                <h4 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-primary" />
                  Nueva Ocasión
                </h4>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
                    <X className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-textMain mb-2">
                      Clave de la Ocasión *
                    </label>
                    <input
                      type="text"
                      value={newOcasion.key}
                      onChange={(e) =>
                        setNewOcasion({
                          ...newOcasion,
                          key: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z_]/g, ""),
                        })
                      }
                      placeholder="ej: graduacion, boda, bautizo"
                      className="w-full px-4 py-3 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain font-mono"
                    />
                    <p className="text-xs text-textSecondary mt-1">
                      Solo letras minúsculas y guiones bajos (_). Se usará
                      internamente.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textMain mb-2">
                      Nombre de la Ocasión *
                    </label>
                    <input
                      type="text"
                      value={newOcasion.label}
                      onChange={(e) =>
                        setNewOcasion({ ...newOcasion, label: e.target.value })
                      }
                      placeholder="ej: Graduación, Boda, Bautizo"
                      className="w-full px-4 py-3 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
                    />
                    <p className="text-xs text-textSecondary mt-1">
                      Este es el nombre que verán los clientes.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textMain mb-2">
                      Icono
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {availableIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setNewOcasion((prev) => ({ ...prev, icon }));
                          }}
                          className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                            newOcasion.icon === icon
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30 scale-105"
                              : "border-secondary/40 hover:border-primary/50 bg-white"
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleAddOcasion}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Ocasión
                    </button>
                    <button
                      onClick={handleClearForm}
                      className="px-6 py-3 border-2 border-secondary/40 text-textMain rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción fijos en el footer */}
          <div className="flex gap-3 pt-4 border-t-2 border-secondary/20">
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="flex-1 px-6 py-3 bg-success text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <PartyPopper className="w-5 h-5" />
                  Guardar Cambios
                  {hasUnsavedChanges && (
                    <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      Sin guardar
                    </span>
                  )}
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={saving}
              className="px-6 py-3 border-2 border-secondary/40 text-textMain rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {hasUnsavedChanges ? "Cancelar" : "Cerrar"}
            </button>
          </div>
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
