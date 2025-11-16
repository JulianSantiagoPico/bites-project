import { useState, useEffect } from "react";
import rolesService from "../services/roles.service";
import { loadRolesFromBackend } from "../utils/empleadosUtils";

/**
 * Hook para gestionar roles del restaurante con sincronización al backend
 */
export const useRoles = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar roles desde el backend
   */
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rolesService.getRoles();

      if (response.success && response.data) {
        loadRolesFromBackend(response.data);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err.message || "Error al cargar roles";
      setError(errorMsg);
      console.error("Error cargando roles:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar roles en el backend
   */
  const saveRoles = async (rolesData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rolesService.updateRoles(rolesData);

      if (response.success && response.data) {
        loadRolesFromBackend(response.data);
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || "Error al actualizar roles",
      };
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar roles";
      setError(errorMsg);
      console.error("Error actualizando roles:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener permisos de un rol
   */
  const getRolePermissions = async (roleName) => {
    try {
      const response = await rolesService.getRolePermissions(roleName);
      return response.data || { permissions: [] };
    } catch (err) {
      console.error(`Error obteniendo permisos del rol ${roleName}:`, err);
      return { permissions: [] };
    }
  };

  /**
   * Obtener todos los permisos
   */
  const getAllPermissions = async () => {
    try {
      const response = await rolesService.getAllPermissions();
      return response.data || { rolePermissions: {} };
    } catch (err) {
      console.error("Error obteniendo todos los permisos:", err);
      return { rolePermissions: {} };
    }
  };

  // Cargar roles al montar el hook
  useEffect(() => {
    loadRoles();
  }, []);

  return {
    loading,
    error,
    loadRoles,
    saveRoles,
    getRolePermissions,
    getAllPermissions,
  };
};
