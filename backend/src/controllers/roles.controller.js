import Restaurante from "../models/Restaurante.js";
import { ROLES, ROLE_PERMISSIONS } from "../config/roles.js";

/**
 * @desc    Obtener roles disponibles del restaurante
 * @route   GET /api/roles
 * @access  Private (Admin)
 */
export const getRoles = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Roles personalizados del restaurante o roles por defecto
    const customRoles = restaurante.customRoles || {};

    // Roles por defecto del sistema (excluir admin)
    const defaultRoles = {
      mesero: "Mesero",
      cocinero: "Cocinero",
      cajero: "Cajero",
      gerente: "Gerente",
    };

    // Iconos por defecto
    const defaultIcons = {
      mesero: "🍽️",
      cocinero: "👨‍🍳",
      cajero: "💰",
      gerente: "👔",
    };

    const rolesDisplay =
      Object.keys(customRoles).length > 0 ? customRoles : defaultRoles;

    const rolesIcons = restaurante.rolesIcons || defaultIcons;

    // Lista de roles
    const rolesList = ["Todos", ...Object.keys(rolesDisplay)];

    res.json({
      success: true,
      data: {
        rolesDisplay,
        rolesList,
        rolesIcons,
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
 * @desc    Actualizar roles personalizados del restaurante
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

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar roles personalizados
    restaurante.customRoles = rolesDisplay;
    restaurante.rolesIcons = rolesIcons || {};

    await restaurante.save();

    // Lista de roles
    const rolesList = ["Todos", ...Object.keys(rolesDisplay)];

    res.json({
      success: true,
      message: "Roles actualizados exitosamente",
      data: {
        rolesDisplay: restaurante.customRoles,
        rolesList,
        rolesIcons: restaurante.rolesIcons,
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

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Primero intentar obtener permisos personalizados
    let permissions = restaurante.customRolePermissions?.get(roleName);

    // Si no hay permisos personalizados, usar los predeterminados
    if (!permissions) {
      permissions = ROLE_PERMISSIONS[roleName] || [];
    }

    if (permissions.length === 0 && roleName !== ROLES.ADMIN) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        role: roleName,
        permissions,
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
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Combinar permisos predeterminados con permisos personalizados
    const customPermissions = restaurante.customRolePermissions || {};
    const allPermissions = { ...ROLE_PERMISSIONS, ...customPermissions };

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

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Inicializar customRolePermissions si no existe
    if (!restaurante.customRolePermissions) {
      restaurante.customRolePermissions = new Map();
    }

    // Actualizar permisos del rol
    restaurante.customRolePermissions.set(roleName, permissions);

    await restaurante.save();

    res.json({
      success: true,
      message: "Permisos actualizados exitosamente",
      data: {
        role: roleName,
        permissions,
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
