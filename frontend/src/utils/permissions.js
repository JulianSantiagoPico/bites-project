/**
 * Definición de permisos del sistema (sincronizado con backend)
 */

// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: "admin",
  MESERO: "mesero",
  COCINERO: "cocinero",
  CAJERO: "cajero",
  GERENTE: "gerente",
};

// Permisos por módulo
export const PERMISSIONS = {
  // Módulo de empleados
  EMPLEADOS: {
    VIEW: "empleados:view",
    CREATE: "empleados:create",
    UPDATE: "empleados:update",
    DELETE: "empleados:delete",
  },

  // Módulo de productos
  PRODUCTOS: {
    VIEW: "productos:view",
    CREATE: "productos:create",
    UPDATE: "productos:update",
    DELETE: "productos:delete",
  },

  // Módulo de inventario
  INVENTARIO: {
    VIEW: "inventario:view",
    CREATE: "inventario:create",
    UPDATE: "inventario:update",
    DELETE: "inventario:delete",
  },

  // Módulo de órdenes
  ORDENES: {
    VIEW: "ordenes:view",
    CREATE: "ordenes:create",
    UPDATE: "ordenes:update",
    DELETE: "ordenes:delete",
    TAKE: "ordenes:take",
  },

  // Módulo de mesas
  MESAS: {
    VIEW: "mesas:view",
    CREATE: "mesas:create",
    UPDATE: "mesas:update",
    DELETE: "mesas:delete",
    CHANGE_STATUS: "mesas:change_status",
    ASSIGN: "mesas:assign",
  },

  // Módulo de reservas
  RESERVAS: {
    VIEW: "reservas:view",
    CREATE: "reservas:create",
    UPDATE: "reservas:update",
    DELETE: "reservas:delete",
  },

  // Perfil de usuario
  PERFIL: {
    VIEW: "perfil:view",
    UPDATE: "perfil:update",
  },

  // Dashboard
  DASHBOARD: {
    VIEW: "dashboard:view",
  },

  // Módulo de estadísticas
  ESTADISTICAS: {
    VIEW: "estadisticas:view",
    EXPORT: "estadisticas:export",
  },
};

// Definición de permisos por rol (debe estar sincronizado con el backend)
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin tiene acceso a todo
    ...Object.values(PERMISSIONS.EMPLEADOS),
    ...Object.values(PERMISSIONS.PRODUCTOS),
    ...Object.values(PERMISSIONS.INVENTARIO),
    ...Object.values(PERMISSIONS.ORDENES),
    ...Object.values(PERMISSIONS.MESAS),
    ...Object.values(PERMISSIONS.RESERVAS),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.ESTADISTICAS),
  ],

  [ROLES.MESERO]: [
    // Mesero: Tomar pedidos, ver órdenes, ver mesas, actualizar órdenes
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.CREATE,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.ORDENES.TAKE,
    PERMISSIONS.MESAS.VIEW,
    PERMISSIONS.MESAS.CHANGE_STATUS,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
    PERMISSIONS.DASHBOARD.VIEW,
  ],

  [ROLES.COCINERO]: [
    // Cocinero: Ver y actualizar órdenes, ver productos
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.INVENTARIO.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
    PERMISSIONS.DASHBOARD.VIEW,
  ],

  [ROLES.CAJERO]: [
    // Cajero: Ver y procesar órdenes, ver productos
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
    PERMISSIONS.DASHBOARD.VIEW,
  ],

  [ROLES.GERENTE]: [
    // Gerente: Acceso completo excepto gestión de empleados y configuración del sistema
    ...Object.values(PERMISSIONS.PRODUCTOS),
    ...Object.values(PERMISSIONS.INVENTARIO),
    ...Object.values(PERMISSIONS.ORDENES),
    ...Object.values(PERMISSIONS.MESAS),
    ...Object.values(PERMISSIONS.RESERVAS),
    ...Object.values(PERMISSIONS.ESTADISTICAS),
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
    PERMISSIONS.DASHBOARD.VIEW,
  ],
};

/**
 * Verificar si un usuario tiene un permiso específico
 */
export const hasPermission = (userRole, permission) => {
  // Primero intentar obtener permisos personalizados del localStorage
  const customPermissions = getCustomRolePermissions();

  if (customPermissions[userRole]) {
    return customPermissions[userRole].includes(permission);
  }

  // Si no hay permisos personalizados, usar los predeterminados
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Verificar si un usuario tiene al menos uno de los permisos
 */
export const hasAnyPermission = (userRole, permissionsList) => {
  return permissionsList.some((permission) =>
    hasPermission(userRole, permission)
  );
};

/**
 * Verificar si un usuario tiene todos los permisos
 */
export const hasAllPermissions = (userRole, permissionsList) => {
  return permissionsList.every((permission) =>
    hasPermission(userRole, permission)
  );
};

/**
 * Obtener todos los permisos de un rol
 */
export const getRolePermissions = (role) => {
  // Primero intentar obtener permisos personalizados del localStorage
  const customPermissions = getCustomRolePermissions();

  if (customPermissions[role]) {
    return customPermissions[role];
  }

  // Si no hay permisos personalizados, usar los predeterminados
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Establecer permisos personalizados para un rol
 */
export const setRolePermissions = async (role, permissions) => {
  // Actualizar localStorage
  const customPermissions = getCustomRolePermissions();
  customPermissions[role] = permissions;
  localStorage.setItem(
    "customRolePermissions",
    JSON.stringify(customPermissions)
  );

  // Actualizar en el backend
  try {
    const { fetchAPI } = await import("../services/config");
    await fetchAPI(`/roles/permissions/${role}`, {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    });
  } catch (error) {
    console.error("Error al actualizar permisos en el backend:", error);
    throw error;
  }
};

/**
 * Obtener permisos personalizados de todos los roles desde localStorage
 */
export const getCustomRolePermissions = () => {
  try {
    const stored = localStorage.getItem("customRolePermissions");
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error al leer permisos personalizados:", error);
    return {};
  }
};

/**
 * Cargar permisos personalizados desde el backend
 */
export const loadCustomPermissionsFromBackend = async () => {
  try {
    const { fetchAPI } = await import("../services/config");
    const response = await fetchAPI("/roles/permissions", {
      method: "GET",
    });

    if (response) {
      localStorage.setItem("customRolePermissions", JSON.stringify(response));
      return response;
    }
  } catch (error) {
    console.error("Error al cargar permisos desde el backend:", error);
  }
  return {};
};
