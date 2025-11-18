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

  /**
   * Actualizar permisos de un rol específico
   */
  const updateRolePermissions = async (roleName, permissions) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rolesService.updateRolePermissions(
        roleName,
        permissions
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        error: response.message || "Error al actualizar permisos",
      };
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar permisos";
      setError(errorMsg);
      console.error("Error actualizando permisos:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar todos los permisos personalizados desde el backend (solo admin)
   */
  const loadAllPermissions = async () => {
    try {
      const response = await rolesService.getAllPermissions();

      if (response.success && response.data) {
        // Guardar permisos en localStorage
        localStorage.setItem(
          "customRolePermissions",
          JSON.stringify(response.data)
        );
        return response.data;
      }

      return {};
    } catch (err) {
      console.error("Error cargando permisos:", err);
      // Si falla (porque no es admin), intentar cargar solo los permisos del usuario actual
      return {};
    }
  };

  // Cargar roles y permisos al montar el hook
  useEffect(() => {
    const loadData = async () => {
      await loadRoles();
      // Intentar cargar todos los permisos (funciona solo para admin)
      await loadAllPermissions();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    loadRoles,
    saveRoles,
    getRolePermissions,
    getAllPermissions,
    updateRolePermissions,
    loadAllPermissions,
  };
};
