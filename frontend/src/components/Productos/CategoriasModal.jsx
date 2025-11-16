import { useState, useEffect } from "react";
import { Tag, Plus, X, Trash2, Edit2 } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditCategoriaModal from "./EditCategoriaModal";

/**
 * Modal para gestionar las categorías del restaurante
 */
const CategoriasModal = ({
  isOpen,
  onClose,
  currentCategorias,
  onUpdateCategorias,
  saving = false,
}) => {
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

  useEffect(() => {
    if (isOpen) {
      // Convertir el objeto categoriasDisplay a array
      const categoriasArray = Object.entries(currentCategorias)
        .filter(
          ([key]) =>
            ![
              "entradas",
              "platos_fuertes",
              "postres",
              "bebidas",
              "extras",
            ].includes(key)
        ) // Excluir predeterminadas
        .map(([key, label]) => ({
          key,
          label,
          icon: getCategoriaIcon(key),
        }));
      setCategorias(categoriasArray);
      setInitialCategorias(JSON.parse(JSON.stringify(categoriasArray)));
      setNewCategoria({ key: "", label: "", icon: "🍽️" });
      setEditingCategoria(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
    }
  }, [isOpen, currentCategorias]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed =
        JSON.stringify(categorias) !== JSON.stringify(initialCategorias);
      setHasUnsavedChanges(changed);
    }
  }, [categorias, initialCategorias, isOpen]);

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
      (c) =>
        c.key.toLowerCase() === categoria.key.toLowerCase()
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
    const categoriasList = [
      "entradas",
      "platos_fuertes",
      "postres",
      "bebidas",
      "extras",
      ...categorias.map((c) => c.key),
    ];

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
        className="rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Gestionar Categorías
              </h3>
              <p className="text-sm text-textSecondary">
                Configura las categorías disponibles para productos
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

        {/* Lista de categorías existentes */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Categorías Actuales
          </h4>
          <div className="space-y-2">
            {categorias.map((categoria, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoria.icon}</span>
                  <div>
                    <p className="font-medium text-textMain">
                      {categoria.label}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {categoria.key}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategoria(index)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar categoría"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategoria(index)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {categorias.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay categorías configuradas</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario para agregar categoría */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Agregar Nueva Categoría
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Clave de la Categoría *
              </label>
              <input
                type="text"
                value={newCategoria.key}
                onChange={(e) =>
                  setNewCategoria({
                    ...newCategoria,
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
                value={newCategoria.label}
                onChange={(e) =>
                  setNewCategoria({ ...newCategoria, label: e.target.value })
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
                    onClick={() => setNewCategoria({ ...newCategoria, icon })}
                    className={`p-2 text-2xl rounded-lg border-2 transition-all ${
                      newCategoria.icon === icon
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
              onClick={handleAddCategoria}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Categoría
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
