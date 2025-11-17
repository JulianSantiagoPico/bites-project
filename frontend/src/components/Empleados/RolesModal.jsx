import { useState, useEffect } from "react";
import { Settings, Plus, X, Trash2, Edit2, Shield } from "lucide-react";
import PermissionsModal from "./PermissionsModal";
import ConfirmDialog from "../ConfirmDialog";
import EditRoleModal from "./EditRoleModal";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * Modal para gestionar los roles del restaurante
 */
const RolesModal = ({
  isOpen,
  onClose,
  currentRoles,
  onUpdateRoles,
  saving = false,
}) => {
  const [roles, setRoles] = useState([]);
  const [initialRoles, setInitialRoles] = useState([]);
  const [newRole, setNewRole] = useState({ key: "", label: "", icon: "👤" });
  const [editingRole, setEditingRole] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState("");
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { getRolePermissions, updateRolePermissions } = usePermissions();

  // Iconos disponibles para los roles
  const availableIcons = ["👤", "🍽️", "👨‍🍳", "💰", "👔", "📋", "🔑", "⚙️", "📊"];

  useEffect(() => {
    if (isOpen) {
      // Convertir el objeto rolesDisplay a array
      const rolesArray = Object.entries(currentRoles)
        .filter(([key]) => key !== "admin") // Excluir admin
        .map(([key, label]) => ({
          key,
          label,
          icon: getRoleIcon(key),
        }));
      setRoles(rolesArray);
      setInitialRoles(JSON.parse(JSON.stringify(rolesArray)));
      setNewRole({ key: "", label: "", icon: "👤" });
      setEditingRole(null);
      setShowEditModal(false);
      setError("");
      setHasUnsavedChanges(false);
    }
  }, [isOpen, currentRoles]);

  // Detectar cambios
  useEffect(() => {
    if (isOpen) {
      const changed = JSON.stringify(roles) !== JSON.stringify(initialRoles);
      setHasUnsavedChanges(changed);
    }
  }, [roles, initialRoles, isOpen]);

  const getRoleIcon = (role) => {
    const icons = {
      mesero: "🍽️",
      cocinero: "👨‍🍳",
      cajero: "💰",
      gerente: "👔",
    };
    return icons[role] || "👤";
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

  const handleAddRole = () => {
    if (!validateRole(newRole)) return;

    const roleToAdd = { ...newRole };
    setRoles([...roles, roleToAdd]);
    setNewRole({ key: "", label: "", icon: "👤" });

    // Abrir modal de permisos automáticamente para el nuevo rol
    setTimeout(() => {
      setSelectedRole(roleToAdd.key);
      setPermissionsModalOpen(true);
    }, 100);
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
  };

  const handleDeleteRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Convertir array a objeto rolesDisplay
    const rolesDisplay = roles.reduce((acc, role) => {
      acc[role.key] = role.label;
      return acc;
    }, {});

    // Convertir array a lista de roles
    const rolesList = ["Todos", ...roles.map((r) => r.key)];

    // Convertir array a iconos
    const rolesIcons = roles.reduce((acc, role) => {
      acc[role.key] = role.icon;
      return acc;
    }, {});

    onUpdateRoles({
      rolesDisplay,
      rolesList,
      rolesIcons,
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
    setNewRole({ key: "", label: "", icon: "👤" });
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
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">
                Gestionar Roles
              </h3>
              <p className="text-sm text-textSecondary">
                Configura los roles disponibles en el restaurante
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

        {/* Lista de roles existentes */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Roles Actuales
          </h4>
          <div className="space-y-2">
            {roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-secondary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <p className="font-medium text-textMain">{role.label}</p>
                    <p className="text-sm text-textSecondary">{role.key}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedRole(role.key);
                      setPermissionsModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                    title="Configurar permisos"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditRole(index)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar rol"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(index)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Eliminar rol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {roles.length === 0 && (
              <div className="text-center py-8 text-textSecondary">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay roles configurados</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulario para agregar rol */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="text-lg font-semibold text-textMain mb-3">
            Agregar Nuevo Rol
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Clave del Rol *
              </label>
              <input
                type="text"
                value={newRole.key}
                onChange={(e) =>
                  setNewRole({ ...newRole, key: e.target.value.toLowerCase() })
                }
                placeholder="ej: gerente"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
              />
              <p className="text-xs text-textSecondary mt-1">
                Solo minúsculas y guiones bajos
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Nombre del Rol *
              </label>
              <input
                type="text"
                value={newRole.label}
                onChange={(e) =>
                  setNewRole({ ...newRole, label: e.target.value })
                }
                placeholder="ej: Gerente"
                className="w-full px-3 py-2 border-2 border-secondary/40 rounded-lg focus:outline-none focus:border-primary transition-colors text-textMain"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-2">
                Icono
              </label>
              <div className="flex flex-wrap gap-2">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewRole({ ...newRole, icon })}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                      newRole.icon === icon
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
              onClick={handleAddRole}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Rol
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
        }}
        role={selectedRole}
        currentPermissions={
          selectedRole ? getRolePermissions(selectedRole) : []
        }
        onSave={async (role, permissions) => {
          await updateRolePermissions(role, permissions);
        }}
      />
    </div>
  );
};

export default RolesModal;
