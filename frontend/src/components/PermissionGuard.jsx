import { usePermissions } from "../hooks/usePermissions";

/**
 * Componente que envuelve elementos y los muestra solo si el usuario tiene el permiso requerido
 *
 * @param {string} permission - Permiso requerido (ej: PERMISSIONS.EMPLEADOS.CREATE)
 * @param {React.ReactNode} children - Elementos a mostrar si tiene permiso
 * @param {React.ReactNode} fallback - Elemento alternativo a mostrar si no tiene permiso (opcional)
 * @returns {React.ReactNode}
 */
const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { can } = usePermissions();

  if (!permission) {
    console.warn("PermissionGuard: No se proporcionó permiso");
    return fallback;
  }

  return can(permission) ? children : fallback;
};

export default PermissionGuard;
