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
  // Dashboard - Todos tienen acceso por defecto
  DASHBOARD: {
    VIEW: "dashboard:view",
  },

  // Perfil - Todos tienen acceso por defecto
  PERFIL: {
    VIEW: "perfil:view",
    UPDATE: "perfil:update",
  },

  // Módulo de Tomar Pedido
  TOMAR_PEDIDO: {
    VIEW: "tomar_pedido:view",
    CREATE: "tomar_pedido:create",
  },

  // Módulo de Productos
  PRODUCTOS: {
    VIEW: "productos:view",
    CREATE: "productos:create",
    UPDATE: "productos:update",
    DELETE: "productos:delete",
  },

  // Módulo de Cocina
  COCINA: {
    VIEW: "cocina:view",
    UPDATE: "cocina:update",
  },

  // Módulo de Mesas
  MESAS: {
    VIEW: "mesas:view",
    CREATE: "mesas:create",
    UPDATE: "mesas:update",
    DELETE: "mesas:delete",
  },

  // Módulo de Reservas
  RESERVAS: {
    VIEW: "reservas:view",
    CREATE: "reservas:create",
    UPDATE: "reservas:update",
    DELETE: "reservas:delete",
  },

  // Módulo de Empleados
  EMPLEADOS: {
    VIEW: "empleados:view",
    CREATE: "empleados:create",
    UPDATE: "empleados:update",
    DELETE: "empleados:delete",
  },

  // Módulo de Estadísticas
  ESTADISTICAS: {
    VIEW: "estadisticas:view",
    EXPORT: "estadisticas:export",
  },

  // Módulo de Configuración
  CONFIGURACION: {
    VIEW: "configuracion:view",
    UPDATE: "configuracion:update",
  },
};

// Definición de permisos por rol (debe estar sincronizado con el backend)
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin tiene acceso a todos los módulos
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.TOMAR_PEDIDO),
    ...Object.values(PERMISSIONS.PRODUCTOS),
    ...Object.values(PERMISSIONS.COCINA),
    ...Object.values(PERMISSIONS.MESAS),
    ...Object.values(PERMISSIONS.RESERVAS),
    ...Object.values(PERMISSIONS.EMPLEADOS),
    ...Object.values(PERMISSIONS.ESTADISTICAS),
    ...Object.values(PERMISSIONS.CONFIGURACION),
  ],

  [ROLES.MESERO]: [
    // Mesero: Inicio, Tomar Pedido, Mesas, Reservas
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.TOMAR_PEDIDO),
    ...Object.values(PERMISSIONS.MESAS),
    ...Object.values(PERMISSIONS.RESERVAS),
  ],

  [ROLES.COCINERO]: [
    // Cocinero (Personal de cocina): Inicio, Cocina
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.COCINA),
  ],

  [ROLES.CAJERO]: [
    // Cajero: Inicio, Tomar Pedido, Mesas, Estadísticas
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.TOMAR_PEDIDO),
    ...Object.values(PERMISSIONS.MESAS),
    PERMISSIONS.ESTADISTICAS.VIEW,
  ],

  [ROLES.GERENTE]: [
    // Gerente: Inicio, Estadísticas, Reservas (lectura), Mesas (lectura), Empleados (lectura), Productos (lectura)
    ...Object.values(PERMISSIONS.DASHBOARD),
    ...Object.values(PERMISSIONS.PERFIL),
    ...Object.values(PERMISSIONS.ESTADISTICAS),
    PERMISSIONS.RESERVAS.VIEW,
    PERMISSIONS.MESAS.VIEW,
    PERMISSIONS.EMPLEADOS.VIEW,
    PERMISSIONS.PRODUCTOS.VIEW,
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
 * Cargar permisos del rol del usuario desde el backend
 */
export const loadUserPermissionsFromBackend = async (userRole) => {
  try {
    if (!userRole) {
      console.warn("No se proporcionó rol de usuario");
      return {};
    }

    const { fetchAPI } = await import("../services/config");
    const response = await fetchAPI(`/roles/${userRole}/permissions`, {
      method: "GET",
    });

    if (response && response.success && response.data) {
      // Guardar solo los permisos del rol actual
      const customPermissions = getCustomRolePermissions();
      customPermissions[userRole] = response.data.permissions || [];
      localStorage.setItem(
        "customRolePermissions",
        JSON.stringify(customPermissions)
      );
      return response.data.permissions || [];
    }
  } catch (error) {
    console.error(`Error al cargar permisos del rol ${userRole}:`, error);
  }
  return [];
};

/**
 * Cargar permisos personalizados desde el backend (solo para admin)
 */
export const loadCustomPermissionsFromBackend = async () => {
  try {
    const { fetchAPI } = await import("../services/config");
    const response = await fetchAPI("/roles/permissions", {
      method: "GET",
    });

    if (response && response.success && response.data) {
      localStorage.setItem(
        "customRolePermissions",
        JSON.stringify(response.data)
      );
      return response.data;
    } else if (response && !response.success) {
      // Si el response no tiene success, asumimos que es el objeto directo
      localStorage.setItem("customRolePermissions", JSON.stringify(response));
      return response;
    }
  } catch (error) {
    console.error("Error al cargar permisos desde el backend:", error);
  }
  return {};
};
