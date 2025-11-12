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
  const icons = {
    mesero: "🍽️",
    cocinero: "👨‍🍳",
    cajero: "💰",
    host: "👔",
  };
  return icons[rol] || "👤";
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
export const rolesDisplay = {
  mesero: "Mesero",
  cocinero: "Cocinero",
  cajero: "Cajero",
  host: "Host",
};

/**
 * Lista de roles disponibles para filtros
 */
export const roles = ["Todos", "mesero", "cocinero", "cajero", "host"];

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
