import Rol from "../models/Rol.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

/**
 * @desc    Obtener roles activos del restaurante
 * @route   GET /api/roles
 * @access  Private (Admin)
 */
export const getRoles = async (req, res) => {
  try {
    // Buscar todos los roles activos del restaurante, ordenados
    const roles = await Rol.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Convertir a formato esperado por el frontend (compatibilidad)
    const rolesDisplay = {};
    const rolesIcons = {};

    roles.forEach((rol) => {
      rolesDisplay[rol.key] = rol.label;
      rolesIcons[rol.key] = rol.icon;
    });

    // Lista de roles (incluir "Todos" al inicio)
    const rolesList = ["Todos", ...roles.map((r) => r.key)];

    res.json({
      success: true,
      data: {
        rolesDisplay,
        rolesList,
        rolesIcons,
        roles: roles.map((rol) => ({
          id: rol._id,
          key: rol.key,
          label: rol.label,
          icon: rol.icon,
          permisos: rol.permisos,
          orden: rol.orden,
          predefinido: rol.predefinido,
          activo: rol.activo,
        })),
      },
    });
  } catch (error) {
    console.error("Error en getRoles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener roles",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener todos los roles (activos e inactivos) del restaurante
 * @route   GET /api/roles/todos
 * @access  Private (Admin)
 */
export const getTodosRoles = async (req, res) => {
  try {
    const roles = await Rol.find({
      restauranteId: req.user.restauranteId,
    }).sort({ orden: 1, createdAt: 1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Error en getTodosRoles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todos los roles",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar roles del restaurante
 * @route   PUT /api/roles
 * @access  Private (Admin)
 */
export const updateRoles = async (req, res) => {
  try {
    const { rolesDisplay, rolesIcons } = req.body;

    if (!rolesDisplay || typeof rolesDisplay !== "object") {
      return res.status(400).json({
        success: false,
        message: "rolesDisplay es requerido y debe ser un objeto",
      });
    }

    const restauranteId = req.user.restauranteId;

    // Obtener roles existentes
    const rolesExistentes = await Rol.find({ restauranteId });
    const existentesMap = new Map(rolesExistentes.map((rol) => [rol.key, rol]));

    // Operaciones a realizar
    const operaciones = [];
    let orden = 1;

    // Procesar cada rol del request
    for (const [key, label] of Object.entries(rolesDisplay)) {
      const icon = rolesIcons?.[key] || "👤";
      const rolExistente = existentesMap.get(key);

      if (rolExistente) {
        // Actualizar rol existente
        operaciones.push(
          Rol.findByIdAndUpdate(
            rolExistente._id,
            {
              label,
              icon,
              orden: orden++,
              activo: true,
            },
            { new: true }
          )
        );
        existentesMap.delete(key);
      } else {
        // Crear nuevo rol con permisos por defecto si existen
        const permisosDefault = ROLE_PERMISSIONS[key] || [];
        operaciones.push(
          Rol.create({
            restauranteId,
            key,
            label,
            icon,
            permisos: permisosDefault,
            orden: orden++,
            predefinido: false,
            activo: true,
          })
        );
      }
    }

    // Desactivar roles que ya no están en la lista (solo los no predefinidos)
    for (const [key, rol] of existentesMap) {
      if (!rol.predefinido) {
        operaciones.push(
          Rol.findByIdAndUpdate(rol._id, { activo: false }, { new: true })
        );
      }
    }

    // Ejecutar todas las operaciones
    await Promise.all(operaciones);

    // Obtener roles actualizados
    const rolesActualizados = await Rol.find({
      restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Formatear respuesta
    const rolesDisplayResult = {};
    const rolesIconsResult = {};

    rolesActualizados.forEach((rol) => {
      rolesDisplayResult[rol.key] = rol.label;
      rolesIconsResult[rol.key] = rol.icon;
    });

    const rolesListResult = ["Todos", ...rolesActualizados.map((r) => r.key)];

    res.json({
      success: true,
      message: "Roles actualizados exitosamente",
      data: {
        rolesDisplay: rolesDisplayResult,
        rolesList: rolesListResult,
        rolesIcons: rolesIconsResult,
        roles: rolesActualizados.map((rol) => ({
          id: rol._id,
          key: rol.key,
          label: rol.label,
          icon: rol.icon,
          permisos: rol.permisos,
          orden: rol.orden,
          predefinido: rol.predefinido,
          activo: rol.activo,
        })),
      },
    });
  } catch (error) {
    console.error("Error en updateRoles:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar roles",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener permisos de un rol específico
 * @route   GET /api/roles/:roleName/permissions
 * @access  Private
 */
export const getRolePermissions = async (req, res) => {
  try {
    const { roleName } = req.params;

    // Buscar el rol en la base de datos
    const rol = await Rol.findOne({
      restauranteId: req.user.restauranteId,
      key: roleName,
      activo: true,
    });

    let permissions = [];

    if (rol) {
      // Usar permisos del rol de la base de datos
      permissions = rol.permisos || [];
    } else {
      // Si no existe en BD, usar permisos predeterminados
      permissions = ROLE_PERMISSIONS[roleName] || [];
    }

    res.json({
      success: true,
      data: {
        role: roleName,
        permissions,
        roleId: rol?._id,
      },
    });
  } catch (error) {
    console.error("Error en getRolePermissions:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener permisos del rol",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener todos los permisos disponibles
 * @route   GET /api/roles/permissions
 * @access  Private (Admin)
 */
export const getAllPermissions = async (req, res) => {
  try {
    // Obtener todos los roles del restaurante
    const roles = await Rol.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    // Construir mapa de permisos
    const allPermissions = {};

    // Agregar permisos de roles de la base de datos
    roles.forEach((rol) => {
      allPermissions[rol.key] = rol.permisos || [];
    });

    // Agregar permisos predeterminados para roles que no estén en BD
    Object.keys(ROLE_PERMISSIONS).forEach((key) => {
      if (!allPermissions[key]) {
        allPermissions[key] = ROLE_PERMISSIONS[key];
      }
    });

    res.json({
      success: true,
      data: allPermissions,
    });
  } catch (error) {
    console.error("Error en getAllPermissions:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener permisos",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar permisos de un rol específico
 * @route   PUT /api/roles/permissions/:roleName
 * @access  Private (Admin)
 */
export const updateRolePermissions = async (req, res) => {
  try {
    const { roleName } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "permissions debe ser un array",
      });
    }

    // Buscar el rol en la base de datos
    const rol = await Rol.findOne({
      restauranteId: req.user.restauranteId,
      key: roleName,
    });

    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado",
      });
    }

    // Actualizar permisos del rol
    rol.permisos = permissions;
    await rol.save();

    res.json({
      success: true,
      message: "Permisos actualizados exitosamente",
      data: {
        role: roleName,
        permissions: rol.permisos,
      },
    });
  } catch (error) {
    console.error("Error en updateRolePermissions:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar permisos",
      error: error.message,
    });
  }
};
