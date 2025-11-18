import Rol from "../models/Rol.js";
import { ROLE_PERMISSIONS } from "../config/roles.js";

/**
 * Inicializar roles predeterminados para un nuevo restaurante
 * @param {ObjectId} restauranteId - ID del restaurante
 */
export const initializeDefaultRoles = async (restauranteId) => {
  try {
    // Verificar si ya tiene roles
    const existingRoles = await Rol.countDocuments({ restauranteId });
    if (existingRoles > 0) {
      console.log(
        `El restaurante ${restauranteId} ya tiene roles inicializados`
      );
      return;
    }

    // Roles predefinidos por defecto
    const defaultRoles = [
      {
        restauranteId,
        key: "mesero",
        label: "Mesero",
        icon: "🍽️",
        permisos: ROLE_PERMISSIONS.mesero || [],
        orden: 1,
        predefinido: true,
        activo: true,
      },
      {
        restauranteId,
        key: "cocinero",
        label: "Cocinero",
        icon: "👨‍🍳",
        permisos: ROLE_PERMISSIONS.cocinero || [],
        orden: 2,
        predefinido: true,
        activo: true,
      },
      {
        restauranteId,
        key: "cajero",
        label: "Cajero",
        icon: "💰",
        permisos: ROLE_PERMISSIONS.cajero || [],
        orden: 3,
        predefinido: true,
        activo: true,
      },
      {
        restauranteId,
        key: "gerente",
        label: "Gerente",
        icon: "👔",
        permisos: ROLE_PERMISSIONS.gerente || [],
        orden: 4,
        predefinido: true,
        activo: true,
      },
    ];

    // Insertar roles predefinidos
    await Rol.insertMany(defaultRoles);
    console.log(
      `✅ Roles predefinidos inicializados para restaurante ${restauranteId}`
    );

    return defaultRoles;
  } catch (error) {
    console.error("Error al inicializar roles predeterminados:", error);
    throw error;
  }
};
