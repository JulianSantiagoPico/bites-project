import { useState, useEffect } from "react";
import { Shield, X, Check } from "lucide-react";
import { PERMISSIONS } from "../../utils/permissions";

/**
 * Modal para asignar permisos a un rol específico
 */
const PermissionsModal = ({
  isOpen,
  onClose,
  role,
  currentPermissions,
  onSave,
  loading = false,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && currentPermissions) {
      setSelectedPermissions([...currentPermissions]);
    }
  }, [isOpen, currentPermissions]);

  if (!isOpen || !role) return null;

  // Agrupar permisos por módulo
  const permissionGroups = {
    "Tomar Pedido": Object.values(PERMISSIONS.TOMAR_PEDIDO),
    Productos: Object.values(PERMISSIONS.PRODUCTOS),
    Cocina: Object.values(PERMISSIONS.COCINA),
    Mesas: Object.values(PERMISSIONS.MESAS),
    Reservas: Object.values(PERMISSIONS.RESERVAS),
    Empleados: Object.values(PERMISSIONS.EMPLEADOS),
    Estadísticas: Object.values(PERMISSIONS.ESTADISTICAS),
    Configuración: Object.values(PERMISSIONS.CONFIGURACION),
  };

  const togglePermission = (permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission)) {
        return prev.filter((p) => p !== permission);
      }
      return [...prev, permission];
    });
  };

  const toggleModule = (modulePermissions) => {
    const allSelected = modulePermissions.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      // Desmarcar todos del módulo
      setSelectedPermissions((prev) =>
        prev.filter((p) => !modulePermissions.includes(p))
      );
    } else {
      // Marcar todos del módulo
      setSelectedPermissions((prev) => [
        ...new Set([...prev, ...modulePermissions]),
      ]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(role, selectedPermissions);
    } finally {
      setSaving(false);
    }
  };

  const getPermissionLabel = (permission) => {
    const parts = permission.split(":");
    const action = parts[1];
    const labels = {
      view: "Ver",
      create: "Crear",
      update: "Actualizar",
      delete: "Eliminar",
      export: "Exportar",
      manage_roles: "Gestionar Roles",
      manage_categories: "Gestionar Categorías",
      manage_locations: "Gestionar Ubicaciones",
      manage_occasions: "Gestionar Ocasiones",
    };
    return labels[action] || action;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background"
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
                Permisos de "{role}"
              </h3>
              <p className="text-sm text-textSecondary">
                Selecciona los permisos que tendrá este rol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Estadísticas */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>{selectedPermissions.length}</strong> permisos seleccionados
          </p>
        </div>

        {/* Nota informativa */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg border-2 border-green-200">
          <p className="text-xs text-green-800">
            ℹ️ <strong>Nota:</strong> Todos los roles tienen acceso por defecto
            a los módulos de <strong>Inicio</strong> y <strong>Perfil</strong>.
          </p>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Grupos de permisos */}
            <div className="space-y-4 mb-6">
              {Object.entries(permissionGroups).map(([module, permissions]) => {
                const allSelected = permissions.every((p) =>
                  selectedPermissions.includes(p)
                );
                const someSelected = permissions.some((p) =>
                  selectedPermissions.includes(p)
                );

                return (
                  <div
                    key={module}
                    className="border-2 border-secondary/40 rounded-lg overflow-hidden"
                  >
                    {/* Header del módulo */}
                    <div
                      className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleModule(permissions)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            allSelected
                              ? "bg-primary border-primary"
                              : someSelected
                              ? "bg-primary/50 border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          {allSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                          {someSelected && !allSelected && (
                            <div className="w-2 h-2 bg-white rounded" />
                          )}
                        </div>
                        <h4 className="font-semibold text-textMain">
                          {module}
                        </h4>
                      </div>
                      <span className="text-sm text-textSecondary">
                        {
                          permissions.filter((p) =>
                            selectedPermissions.includes(p)
                          ).length
                        }
                        /{permissions.length}
                      </span>
                    </div>

                    {/* Lista de permisos */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                      {permissions.map((permission) => {
                        const isSelected =
                          selectedPermissions.includes(permission);
                        return (
                          <button
                            key={permission}
                            onClick={() => togglePermission(permission)}
                            className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isSelected
                                  ? "text-primary font-medium"
                                  : "text-textSecondary"
                              }`}
                            >
                              {getPermissionLabel(permission)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 px-6 py-3 bg-success text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              "Guardar Permisos"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 border-2 border-secondary/40 text-textMain rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
