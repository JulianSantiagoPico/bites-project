import { fetchAPI } from "./config";

/**
 * Servicio para gestionar roles del restaurante
 */

/**
 * Obtener roles del restaurante
 */
export const getRoles = async () => {
  return await fetchAPI("/roles", {
    method: "GET",
  });
};

/**
 * Obtener todos los roles (activos e inactivos) del restaurante
 */
export const getTodosRoles = async () => {
  return await fetchAPI("/roles/todos", {
    method: "GET",
  });
};

/**
 * Actualizar roles personalizados del restaurante
 */
export const updateRoles = async (rolesData) => {
  return await fetchAPI("/roles", {
    method: "PUT",
    body: JSON.stringify(rolesData),
  });
};

/**
 * Obtener permisos de un rol específico
 */
export const getRolePermissions = async (roleName) => {
  return await fetchAPI(`/roles/${roleName}/permissions`, {
    method: "GET",
  });
};

/**
 * Obtener todos los permisos disponibles
 */
export const getAllPermissions = async () => {
  return await fetchAPI("/roles/permissions", {
    method: "GET",
  });
};

/**
 * Actualizar permisos de un rol específico
 */
export const updateRolePermissions = async (roleName, permissions) => {
  return await fetchAPI(`/roles/permissions/${roleName}`, {
    method: "PUT",
    body: JSON.stringify({ permissions }),
  });
};

const rolesService = {
  getRoles,
  getTodosRoles,
  updateRoles,
  getRolePermissions,
  getAllPermissions,
  updateRolePermissions,
};

export default rolesService;
