import { useAuth } from "../context/AuthContext";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions as getPermissionsForRole,
  setRolePermissions,
} from "../utils/permissions";

/**
 * Hook para verificar permisos del usuario actual
 */
export const usePermissions = () => {
  const { user } = useAuth();

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  const can = (permission) => {
    if (!user) return false;
    return hasPermission(user.rol, permission);
  };

  /**
   * Verificar si el usuario tiene al menos uno de los permisos
   */
  const canAny = (permissionsList) => {
    if (!user) return false;
    return hasAnyPermission(user.rol, permissionsList);
  };

  /**
   * Verificar si el usuario tiene todos los permisos
   */
  const canAll = (permissionsList) => {
    if (!user) return false;
    return hasAllPermissions(user.rol, permissionsList);
  };

  /**
   * Obtener todos los permisos del usuario actual
   */
  const getPermissions = () => {
    if (!user) return [];
    return getPermissionsForRole(user.rol);
  };

  /**
   * Obtener permisos de un rol específico
   */
  const getRolePermissions = (role) => {
    return getPermissionsForRole(role);
  };

  /**
   * Actualizar permisos de un rol específico
   */
  const updateRolePermissions = async (role, permissions) => {
    return setRolePermissions(role, permissions);
  };

  /**
   * Verificar si el usuario es admin
   */
  const isAdmin = () => {
    return user?.rol === "admin";
  };

  return {
    can,
    canAny,
    canAll,
    getPermissions,
    getRolePermissions,
    updateRolePermissions,
    isAdmin,
    userRole: user?.rol,
  };
};

export default usePermissions;
