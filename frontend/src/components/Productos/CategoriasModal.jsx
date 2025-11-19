import { useState, useEffect } from "react";
import { Tag, Plus, X, Trash2, Edit2, List, FolderPlus } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditCategoriaModal from "./EditCategoriaModal";

/**
 * Modal para gestionar las categorías del restaurante
 */
const CategoriasModal = ({
  isOpen,
  onClose,
  currentCategorias,
  currentIcons = {},
  onUpdateCategorias,
  saving = false,
}) => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' o 'add'
  const [categorias, setCategorias] = useState([]);
  const [initialCategorias, setInitialCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState({
    key: "",
    label: "",
    icon: "🍽️",
  });
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Iconos disponibles para las categorías
  const availableIcons = ["🍽️", "🍕", "🍔", "🥗", "🍜", "🍰", "☕", "🍹"];

  // Función helper para obtener icono por defecto de una categoría
  const getCategoriaIcon = (categoria) => {
    const icons = {
      entradas: "🥗",
      platos_fuertes: "🍽️",
      postres: "🍰",
      bebidas: "🍹",
      extras: "🍟",
    };
    return icons[categoria] || "🍽️";
  };

  useEffect(() => {
    if (isOpen) {
      // Validar que currentCategorias sea un objeto válido
      if (
        !currentCategorias ||
        typeof currentCategorias !== "object" ||
        Array.isArray(currentCategorias)
      ) {
        console.error(
          "currentCategorias no es un objeto válido:",
          currentCategorias
        );
        setCategorias([]);
        setInitialCategorias([]);
        return;
      }

      // Convertir el objeto categoriasDisplay a array (incluye predefinidas y personalizadas)
      const categoriasArray = Object.entries(currentCategorias)
        .filter(([key, label]) => {
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
              : getCategoriaIcon(key),
        }));

      setCategorias(categoriasArray);
      setInitialCategorias(JSON.parse(JSON.stringify(categoriasArray)));
      setNewCategoria({ key: "", label: "", icon: "🍽️" });
      setEditingCategoria(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
      setActiveTab("list"); // Resetear a la pestaña de lista
    }
  }, [isOpen, currentCategorias, currentIcons]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(categorias) !== JSON.stringify(initialCategorias);
      setHasUnsavedChanges(changed);
    }
  }, [categorias, initialCategorias, isOpen]);

  const validateCategoria = (categoria) => {
    if (!categoria.key.trim()) {
      setError("La clave de la categoría es requerida");
      return false;
    }

    if (!categoria.label.trim()) {
      setError("El nombre de la categoría es requerido");
      return false;
    }

    // Validar que la clave no exista ya
    const keyExists = categorias.some(
      (c) => c.key.toLowerCase() === categoria.key.toLowerCase()
    );

    if (keyExists) {
      setError("Ya existe una categoría con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(categoria.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleAddCategoria = () => {
    if (!validateCategoria(newCategoria)) return;

    setCategorias([...categorias, { ...newCategoria }]);
    setNewCategoria({ key: "", label: "", icon: "🍽️" });
    setError("");
    // Cambiar a la pestaña de lista para ver la categoría agregada
    setActiveTab("list");
  };

  const handleEditCategoria = (index) => {
    setEditingCategoria({ ...categorias[index], index });
    setShowEditModal(true);
  };

  const handleSaveEdit = (editedCategoria) => {
    const updatedCategorias = [...categorias];
    updatedCategorias[editingCategoria.index] = {
      key: editedCategoria.key,
      label: editedCategoria.label,
      icon: editedCategoria.icon,
    };
    setCategorias(updatedCategorias);
    setEditingCategoria(null);
  };

  const handleDeleteCategoria = (index) => {
    setCategorias(categorias.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Convertir array a objeto categoriasDisplay
    const categoriasDisplay = categorias.reduce((acc, categoria) => {
      acc[categoria.key] = categoria.label;
      return acc;
    }, {});

    // Convertir array a lista de categorías
    const categoriasList = categorias.map((c) => c.key);

    // Convertir array a iconos
    const categoriasIcons = categorias.reduce((acc, categoria) => {
      acc[categoria.key] = categoria.icon;
      return acc;
    }, {});

    onUpdateCategorias({
      categoriasDisplay,
      categoriasList,
      categoriasIcons,
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
    setNewCategoria({ key: "", label: "", icon: "🍽️" });
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
            <Tag className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">
                Gestionar Categorías
              </h2>
              <p className="text-sm text-white/80">
                Configura las categorías disponibles para productos
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
              Categorías
              {categorias.length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "list"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {categorias.length}
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
              Agregar Categoría
              {activeTab === "add" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto mb-6">
            {/* Tab: Lista de Categorías */}
            {activeTab === "list" && (
              <div className="space-y-2">
                {categorias.length === 0 ? (
                  <div className="text-center py-12 text-textSecondary bg-white rounded-lg border-2 border-dashed border-secondary/40">
                    <Tag className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium mb-1">
                      No hay categorías
                    </p>
                    <p className="text-sm mb-4">
                      Comienza agregando tu primera categoría
                    </p>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Categoría
                    </button>
                  </div>
                ) : (
                  <>
                    {categorias.map((categoria, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-secondary/40 hover:border-primary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl bg-background rounded-lg p-2">
                            {categoria.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-textMain text-lg">
                              {categoria.label}
                            </p>
                            <p className="text-sm text-textSecondary font-mono">
                              {categoria.key}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditCategoria(index)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Editar categoría"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategoria(index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Eliminar categoría"
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

            {/* Tab: Agregar Categoría */}
            {activeTab === "add" && (
              <div className="bg-white rounded-lg p-6 border-2 border-secondary/40">
                <h4 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-primary" />
                  Nueva Categoría
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
                      Clave de la Categoría *
                    </label>
                    <input
                      type="text"
                      value={newCategoria.key}
                      onChange={(e) =>
                        setNewCategoria({
                          ...newCategoria,
                          key: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z_]/g, ""),
                        })
                      }
                      placeholder="ej: ensaladas, sopas, carnes"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain font-mono ${
                        error && !newCategoria.key.trim()
                          ? "border-red-500"
                          : "border-secondary/40 focus:border-primary"
                      }`}
                    />
                    <p className="text-xs text-textSecondary mt-1">
                      Solo letras minúsculas y guiones bajos (_). Se usará
                      internamente.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textMain mb-2">
                      Nombre de la Categoría *
                    </label>
                    <input
                      type="text"
                      value={newCategoria.label}
                      onChange={(e) =>
                        setNewCategoria({
                          ...newCategoria,
                          label: e.target.value,
                        })
                      }
                      placeholder="ej: Ensaladas, Sopas, Carnes"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain ${
                        error && !newCategoria.label.trim()
                          ? "border-red-500"
                          : "border-secondary/40 focus:border-primary"
                      }`}
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
                            setNewCategoria((prev) => ({ ...prev, icon }));
                          }}
                          className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                            newCategoria.icon === icon
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
                      onClick={handleAddCategoria}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Categoría
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
                  <Tag className="w-5 h-5" />
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
      <EditCategoriaModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        categoria={editingCategoria}
        onSave={handleSaveEdit}
        existingCategorias={categorias}
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

export default CategoriasModal;
