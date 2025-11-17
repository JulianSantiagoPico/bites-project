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

// Definición de permisos por rol
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

// Verificar si un rol tiene un permiso específico
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Obtener todos los permisos de un rol
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
