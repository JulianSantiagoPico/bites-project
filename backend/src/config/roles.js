// Roles disponibles en el sistema
export const ROLES = {
  ADMIN: "admin",
  MESERO: "mesero",
  COCINERO: "cocinero",
  CAJERO: "cajero",
  HOST: "host",
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
  ],

  [ROLES.MESERO]: [
    // Mesero: Tomar pedidos, ver órdenes, ver mesas, actualizar órdenes
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.CREATE,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.ORDENES.TAKE,
    PERMISSIONS.MESAS.VIEW,
    PERMISSIONS.MESAS.UPDATE,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
  ],

  [ROLES.COCINERO]: [
    // Cocinero: Ver y actualizar órdenes, ver productos
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.INVENTARIO.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
  ],

  [ROLES.CAJERO]: [
    // Cajero: Ver y procesar órdenes, ver productos
    PERMISSIONS.ORDENES.VIEW,
    PERMISSIONS.ORDENES.UPDATE,
    PERMISSIONS.PRODUCTOS.VIEW,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
  ],

  [ROLES.HOST]: [
    // Host: Gestionar reservas y mesas
    PERMISSIONS.RESERVAS.VIEW,
    PERMISSIONS.RESERVAS.CREATE,
    PERMISSIONS.RESERVAS.UPDATE,
    PERMISSIONS.RESERVAS.DELETE,
    PERMISSIONS.MESAS.VIEW,
    PERMISSIONS.MESAS.UPDATE,
    PERMISSIONS.PERFIL.VIEW,
    PERMISSIONS.PERFIL.UPDATE,
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
