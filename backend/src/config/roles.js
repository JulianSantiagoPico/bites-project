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

// Definición de permisos por rol
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

// Verificar si un rol tiene un permiso específico (solo para roles predeterminados)
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Verificar permisos incluyendo roles personalizados (asíncrono)
export const hasPermissionAsync = async (role, permission, restauranteId) => {
  // Primero verificar si es un rol predeterminado
  if (ROLE_PERMISSIONS[role]) {
    return ROLE_PERMISSIONS[role].includes(permission);
  }

  // Si no, buscar en la base de datos
  try {
    const Rol = (await import("../models/Rol.js")).default;
    const rolCustom = await Rol.findOne({
      restauranteId,
      key: role,
      activo: true,
    });

    return rolCustom?.permisos?.includes(permission) || false;
  } catch (error) {
    console.error("Error al verificar permisos personalizados:", error);
    return false;
  }
};

// Obtener todos los permisos de un rol
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
