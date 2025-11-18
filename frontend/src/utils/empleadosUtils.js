/**
 * Utilidades para el módulo de empleados
 */

/**
 * Retorna los colores para el estado del empleado (activo/inactivo)
 * Usa los colores del tema CSS
 */
export const getStatusColor = (activo) => {
  if (activo) {
    return {
      bg: "bg-success/10",
      text: "text-success",
      border: "border-success/20",
    };
  }
  return {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/20",
  };
};

/**
 * Retorna el icono emoji correspondiente al rol del empleado
 */
export const getRoleIcon = (rol) => {
  return rolesIcons[rol] || "👤";
};

/**
 * Formato de fecha legible en español
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Diccionario de roles con sus etiquetas de visualización
 */
export let rolesDisplay = {
  admin: "Administrador",
  mesero: "Mesero",
  cocinero: "Cocinero",
  cajero: "Cajero",
  gerente: "Gerente",
};

/**
 * Lista de roles disponibles para filtros
 */
export let roles = [
  "Todos",
  "admin",
  "mesero",
  "cocinero",
  "cajero",
  "gerente",
];

/**
 * Iconos para cada rol
 */
export let rolesIcons = {
  admin: "👑",
  mesero: "🍽️",
  cocinero: "👨‍🍳",
  cajero: "💰",
  gerente: "👔",
};

/**
 * Actualizar los roles del sistema (en memoria y backend)
 */
export const updateRoles = (newRolesDisplay, newRolesList, newRolesIcons) => {
  rolesDisplay = { ...newRolesDisplay };
  roles = [...newRolesList];
  rolesIcons = { ...newRolesIcons };
};

/**
 * Cargar roles desde el backend y actualizar el estado local
 * Siempre preserva el rol de admin
 */
export const loadRolesFromBackend = (backendRoles) => {
  if (backendRoles.rolesDisplay) {
    rolesDisplay = {
      admin: "Administrador", // Preservar siempre el rol admin
      ...backendRoles.rolesDisplay,
    };
  }
  if (backendRoles.rolesList) {
    // Asegurar que admin esté en la lista si no está
    const hasAdmin = backendRoles.rolesList.includes("admin");
    roles = hasAdmin
      ? [...backendRoles.rolesList]
      : [
          "Todos",
          "admin",
          ...backendRoles.rolesList.filter((r) => r !== "Todos"),
        ];
  }
  if (backendRoles.rolesIcons) {
    rolesIcons = {
      admin: "👑", // Preservar siempre el icono del admin
      ...backendRoles.rolesIcons,
    };
  }
};

/**
 * Obtener roles actuales
 */
export const getCurrentRoles = () => ({
  rolesDisplay: { ...rolesDisplay },
  roles: [...roles],
  rolesIcons: { ...rolesIcons },
});

/**
 * Retorna las clases de estilo para los tipos de notificación
 * Usa los colores del tema CSS
 */
export const getNotificationStyles = (type = "info") => {
  switch (type) {
    case "success":
      return {
        bg: "bg-success/10",
        border: "border-success/20",
        text: "text-success",
        iconColor: "text-success",
      };
    case "error":
      return {
        bg: "bg-error/10",
        border: "border-error/20",
        text: "text-error",
        iconColor: "text-error",
      };
    case "warning":
      return {
        bg: "bg-warning/10",
        border: "border-warning/20",
        text: "text-warning",
        iconColor: "text-warning",
      };
    case "info":
    default:
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        iconColor: "text-blue-500",
      };
  }
};

/**
 * Retorna las clases de estilo para los diálogos de confirmación
 * Usa los colores del tema CSS
 */
export const getConfirmDialogStyles = (type = "warning") => {
  switch (type) {
    case "danger":
      return {
        iconBg: "bg-error/10",
        iconColor: "text-error",
        confirmBg: "bg-error hover:bg-error/90",
      };
    case "success":
      return {
        iconBg: "bg-success/10",
        iconColor: "text-success",
        confirmBg: "bg-success hover:bg-success/90",
      };
    case "warning":
    default:
      return {
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
        confirmBg: "bg-warning hover:bg-warning/90",
      };
  }
};
