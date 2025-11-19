import { useState, useEffect, useRef } from "react";
import { Shield, Plus, X, Trash2, Edit2, List, FolderPlus } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import EditRoleModal from "./EditRoleModal";
import PermissionsModal from "./PermissionsModal";
import { useRoles } from "../../hooks/useRoles";

/**
 * Modal para gestionar los roles del restaurante
 */
const RolesModal = ({
  isOpen,
  onClose,
  currentRoles,
  currentIcons = {},
  onUpdateRoles,
  saving = false,
  showNotification,
}) => {
  const [activeTab, setActiveTab] = useState("list"); // 'list' o 'add'
  const [roles, setRoles] = useState([]);
  const initialRolesRef = useRef([]);
  const [newRole, setNewRole] = useState({
    key: "",
    label: "",
    icon: "👤",
  });
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  const { getRolePermissions, updateRolePermissions } = useRoles();

  // Iconos disponibles para los roles
  const availableIcons = [
    "👤",
    "🍽️",
    "👨‍🍳",
    "💰",
    "👔",
    "📋",
    "🔑",
    "⚙️",
    "📊",
    "🎯",
    "🏆",
    "⭐",
  ];

  // Función helper para obtener icono por defecto de un rol
  const getRoleIcon = (role) => {
    const icons = {
      mesero: "🍽️",
      cocinero: "👨‍🍳",
      cajero: "💰",
      gerente: "👔",
    };
    return icons[role] || "👤";
  };

  useEffect(() => {
    if (isOpen) {
      // Validar que currentRoles sea un objeto válido
      if (
        !currentRoles ||
        typeof currentRoles !== "object" ||
        Array.isArray(currentRoles)
      ) {
        console.error("currentRoles no es un objeto válido:", currentRoles);
        setRoles([]);
        initialRolesRef.current = [];
        return;
      }

      // Convertir el objeto rolesDisplay a array (excluir "admin" y "Todos")
      const rolesArray = Object.entries(currentRoles)
        .filter(([key, label]) => {
          // Excluir admin y Todos
          if (["admin", "Todos"].includes(key)) {
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
              : getRoleIcon(key),
        }));

      setRoles(rolesArray);
      initialRolesRef.current = JSON.parse(JSON.stringify(rolesArray));
      setNewRole({ key: "", label: "", icon: "👤" });
      setEditingRole(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
      setActiveTab("list"); // Resetear a la pestaña de lista
    } else {
      // Limpiar estado cuando se cierra el modal
      setActiveTab("list");
    }
  }, [isOpen]);

  // Función helper para verificar cambios
  const checkUnsavedChanges = () => {
    return JSON.stringify(roles) !== JSON.stringify(initialRolesRef.current);
  };

  const validateRole = (role) => {
    if (!role.key.trim()) {
      setError("La clave del rol es requerida");
      return false;
    }

    if (!role.label.trim()) {
      setError("El nombre del rol es requerido");
      return false;
    }

    // Validar que la clave no exista ya
    const keyExists = roles.some(
      (r) => r.key.toLowerCase() === role.key.toLowerCase()
    );

    if (keyExists) {
      setError("Ya existe un rol con esa clave");
      return false;
    }

    // Validar que la clave solo contenga letras minúsculas y guiones bajos
    if (!/^[a-z_]+$/.test(role.key)) {
      setError(
        "La clave solo puede contener letras minúsculas y guiones bajos"
      );
      return false;
    }

    setError("");
    return true;
  };

  const saveRolesToBackend = async (updatedRoles) => {
    // Convertir array a objeto rolesDisplay
    const rolesDisplay = updatedRoles.reduce((acc, role) => {
      acc[role.key] = role.label;
      return acc;
    }, {});

    // Convertir array a lista de roles
    const rolesList = ["Todos", ...updatedRoles.map((r) => r.key)];

    // Convertir array a iconos
    const rolesIcons = updatedRoles.reduce((acc, role) => {
      acc[role.key] = role.icon;
      return acc;
    }, {});

    return await onUpdateRoles({
      rolesDisplay,
      rolesList,
      rolesIcons,
    });
  };

  const handleAddRole = async () => {
    if (!validateRole(newRole)) return;

    const updatedRoles = [...roles, { ...newRole }];

    // Guardar inmediatamente
    const success = await saveRolesToBackend(updatedRoles);

    if (success) {
      setRoles(updatedRoles);
      const newRoleKey = newRole.key;
      setNewRole({ key: "", label: "", icon: "👤" });
      setError("");
      setHasUnsavedChanges(false);

      // Abrir modal de permisos automáticamente
      handleOpenPermissions(newRoleKey);

      // Cambiar a la pestaña de lista
      setActiveTab("list");
    }
  };

  const handleEditRole = (index) => {
    setEditingRole({ ...roles[index], index });
    setShowEditModal(true);
  };

  const handleSaveEdit = (editedRole) => {
    const updatedRoles = [...roles];
    updatedRoles[editingRole.index] = {
      key: editedRole.key,
      label: editedRole.label,
      icon: editedRole.icon,
    };
    setRoles(updatedRoles);
    setEditingRole(null);
    setHasUnsavedChanges(true);
  };

  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    await saveRolesToBackend(roles);
    setHasUnsavedChanges(false);
    // No cerramos aquí, el padre se encargará de cerrar después de actualizar
  };

  const handleClose = () => {
    const hasChanges = checkUnsavedChanges();
    if (hasChanges) {
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
    setNewRole({ key: "", label: "", icon: "👤" });
    setError("");
  };

  const handleOpenPermissions = async (roleKey) => {
    setSelectedRole(roleKey);
    setLoadingPermissions(true);
    setPermissionsModalOpen(true);

    try {
      const response = await getRolePermissions(roleKey);
      setCurrentPermissions(response.permissions || []);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
      showNotification("Error al cargar permisos del rol", "error");
      setCurrentPermissions([]);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSavePermissions = async (roleKey, permissions) => {
    try {
      const response = await updateRolePermissions(roleKey, permissions);

      if (response.success) {
        showNotification("Permisos actualizados correctamente", "success");
        setPermissionsModalOpen(false);
        setSelectedRole(null);
        setCurrentPermissions([]);
      } else {
        showNotification(
          response.error || "Error al actualizar permisos",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al guardar permisos:", error);
      showNotification("Error al guardar permisos", "error");
    }
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
            <Shield className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Gestionar Roles</h2>
              <p className="text-sm text-white/80">
                Configura los roles disponibles para los empleados
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
              Roles
              {roles.length > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === "list"
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {roles.length}
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
              Agregar Rol
              {activeTab === "add" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="flex-1 overflow-y-auto mb-6">
            {/* Tab: Lista de Roles */}
            {activeTab === "list" && (
              <div className="space-y-2">
                {roles.length === 0 ? (
                  <div className="text-center py-12 text-textSecondary bg-white rounded-lg border-2 border-dashed border-secondary/40">
                    <Shield className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p className="text-lg font-medium mb-1">No hay roles</p>
                    <p className="text-sm mb-4">
                      Comienza agregando tu primer rol personalizado
                    </p>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Rol
                    </button>
                  </div>
                ) : (
                  <>
                    {roles.map((role, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-secondary/40 hover:border-primary/40 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl bg-background rounded-lg p-2">
                            {role.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-textMain text-lg">
                              {role.label}
                            </p>
                            <p className="text-sm text-textSecondary font-mono">
                              {role.key}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenPermissions(role.key)}
                            className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                            title="Configurar permisos"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditRole(index)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Editar rol"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Eliminar rol"
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

            {/* Tab: Agregar Rol */}
            {activeTab === "add" && (
              <div className="bg-white rounded-lg p-6 border-2 border-secondary/40">
                <h4 className="text-lg font-semibold text-textMain mb-4 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-primary" />
                  Nuevo Rol
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
                      Clave del Rol *
                    </label>
                    <input
                      type="text"
                      value={newRole.key}
                      onChange={(e) =>
                        setNewRole({
                          ...newRole,
                          key: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z_]/g, ""),
                        })
                      }
                      placeholder="ej: supervisor, ayudante"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain font-mono ${
                        error && !newRole.key.trim()
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
                      Nombre del Rol *
                    </label>
                    <input
                      type="text"
                      value={newRole.label}
                      onChange={(e) =>
                        setNewRole({ ...newRole, label: e.target.value })
                      }
                      placeholder="ej: Supervisor, Ayudante"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-textMain ${
                        error && !newRole.label.trim()
                          ? "border-red-500"
                          : "border-secondary/40 focus:border-primary"
                      }`}
                    />
                    <p className="text-xs text-textSecondary mt-1">
                      Este es el nombre que verán los empleados.
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
                            setNewRole((prev) => ({ ...prev, icon }));
                          }}
                          className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                            newRole.icon === icon
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
                      onClick={handleAddRole}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Rol
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
                  <Shield className="w-5 h-5" />
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
      <EditRoleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        role={editingRole}
        onSave={handleSaveEdit}
        existingRoles={roles}
      />

      {/* Modal de permisos */}
      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => {
          setPermissionsModalOpen(false);
          setSelectedRole(null);
          setCurrentPermissions([]);
        }}
        role={selectedRole}
        currentPermissions={currentPermissions}
        onSave={handleSavePermissions}
        loading={loadingPermissions}
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

export default RolesModal;
