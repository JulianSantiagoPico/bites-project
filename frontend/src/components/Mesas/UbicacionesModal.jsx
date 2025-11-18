import { useState, useEffect } from "react";
import { MapPin, Plus, X, Trash2, Edit2, List, FolderPlus } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditUbicacionModal from "./EditUbicacionModal";

/**
 * Modal para gestionar las ubicaciones del restaurante
 */
const UbicacionesModal = ({
  isOpen,
  onClose,
  currentUbicaciones,
  currentIcons = {},
  onUpdateUbicaciones,
  saving = false,
}) => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' o 'add'
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
  const availableIcons = [
    "📍",
    "🏠",
    "🌳",
    "☀️",
    "🍺",
    "🔒",
    "🪟",
    "🏞️",
    "🚪",
    "🏛️",
    "🎭",
    "🎪",
  ];

  // Función helper para obtener icono por defecto de una ubicación
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

  useEffect(() => {
    if (isOpen) {
      // Validar que currentUbicaciones sea un objeto válido
      if (
        !currentUbicaciones ||
        typeof currentUbicaciones !== "object" ||
        Array.isArray(currentUbicaciones)
      ) {
        console.error(
          "currentUbicaciones no es un objeto válido:",
          currentUbicaciones
        );
        setUbicaciones([]);
        setInitialUbicaciones([]);
        return;
      }

      // Convertir el objeto ubicacionesDisplay a array
      const ubicacionesArray = Object.entries(currentUbicaciones)
        .filter(([key, label]) => {
          // Excluir ubicaciones predeterminadas
          if (
            ["interior", "exterior", "terraza", "barra", "privado"].includes(
              key
            )
          ) {
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
              : getUbicacionIcon(key),
        }));

      setUbicaciones(ubicacionesArray);
      setInitialUbicaciones(JSON.parse(JSON.stringify(ubicacionesArray)));
      setNewUbicacion({ key: "", label: "", icon: "📍" });
      setEditingUbicacion(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
      setActiveTab("list"); // Resetear a la pestaña de lista
    }
  }, [isOpen, currentUbicaciones, currentIcons]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(ubicaciones) !== JSON.stringify(initialUbicaciones);
      setHasUnsavedChanges(changed);
    }
  }, [ubicaciones, isOpen]); // Removido initialUbicaciones de las dependencias

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

    // Validar que la clave solo contenga letras minúsculas, números y guiones bajos
    if (!/^[a-z0-9_]+$/.test(ubicacion.key)) {
      setError(
        "La clave solo puede contener letras minúsculas, números y guiones bajos"
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
    setError("");
    // Cambiar a la pestaña de lista para ver la ubicación agregada
    setActiveTab("list");
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
    // Convertir array de ubicaciones personalizadas al formato que espera el backend
    const ubicacionesArray = ubicaciones.map((ubicacion, index) => ({
      key: ubicacion.key,
      label: ubicacion.label,
      icon: ubicacion.icon,
      orden: index,
      activo: true,
      _id: ubicacion._id, // Si existe, para actualizar
    }));

    onUpdateUbicaciones({
      ubicaciones: ubicacionesArray,
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
        className="rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-hidden bg-background flex flex-col"
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
                Configura las ubicaciones disponibles para las mesas
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
            Ubicaciones
            {ubicaciones.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "list"
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {ubicaciones.length}
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
            Agregar Ubicación
            {activeTab === "add" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto mb-6">
          {/* Tab: Lista de Ubicaciones */}
          {activeTab === "list" && (
            <div className="space-y-2">
              {ubicaciones.length === 0 ? (
                <div className="text-center py-12 text-textSecondary bg-white rounded-lg border-2 border-dashed border-secondary/40">
                  <MapPin className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium mb-1">
                    No hay ubicaciones personalizadas
                  </p>
                  <p className="text-sm mb-4">
                    Comienza agregando tu primera ubicación especial
                  </p>
                  <button
                    onClick={() => setActiveTab("add")}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Ubicación
                  </button>
                </div>
              ) : (
                <>
                  {ubicaciones.map((ubicacion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-secondary/40 hover:border-primary/40 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl bg-background rounded-lg p-2">
                          {ubicacion.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-textMain text-lg">
                            {ubicacion.label}
                          </p>
                          <p className="text-sm text-textSecondary font-mono">
                            {ubicacion.key}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditUbicacion(index)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Editar ubicación"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUbicacion(index)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Eliminar ubicación"
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

          {/* Tab: Agregar Ubicación */}
          {activeTab === "add" && (
            <div className="bg-white rounded-lg p-6 border-2 border-secondary/40">
              <h4 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" />
                Nueva Ubicación
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
                    Clave de la Ubicación *
                  </label>
                  <input
                    type="text"
                    value={newUbicacion.key}
                    onChange={(e) =>
                      setNewUbicacion({
                        ...newUbicacion,
                        key: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9_]/g, ""),
                      })
                    }
                    placeholder="ej: ventana, esquina, jardin"
                    className="w-full px-4 py-3 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain font-mono"
                  />
                  <p className="text-xs text-textSecondary mt-1">
                    Solo letras minúsculas, números y guiones bajos (_). Se
                    usará internamente.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-textMain mb-2">
                    Nombre de la Ubicación *
                  </label>
                  <input
                    type="text"
                    value={newUbicacion.label}
                    onChange={(e) =>
                      setNewUbicacion({
                        ...newUbicacion,
                        label: e.target.value,
                      })
                    }
                    placeholder="ej: Junto a Ventana, Esquina, Jardín"
                    className="w-full px-4 py-3 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
                  />
                  <p className="text-xs text-textSecondary mt-1">
                    Este es el nombre que verán los usuarios.
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
                          setNewUbicacion((prev) => ({ ...prev, icon }));
                        }}
                        className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                          newUbicacion.icon === icon
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
                    onClick={handleAddUbicacion}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar Ubicación
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
                <MapPin className="w-5 h-5" />
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
        type="primary"
      />
    </div>
  );
};

export default UbicacionesModal;
