import Restaurante from "../models/Restaurante.js";

/**
 * @desc    Obtener ubicaciones disponibles del restaurante
 * @route   GET /api/ubicaciones
 * @access  Private
 */
export const getUbicaciones = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Ubicaciones personalizadas del restaurante o ubicaciones por defecto
    const customUbicaciones = restaurante.customUbicaciones || {};

    // Ubicaciones por defecto del sistema
    const defaultUbicaciones = {
      interior: "Interior",
      exterior: "Exterior",
      terraza: "Terraza",
      barra: "Barra",
      privado: "Privado",
    };

    // Iconos por defecto
    const defaultIcons = {
      interior: "🏠",
      exterior: "🌳",
      terraza: "☀️",
      barra: "🍺",
      privado: "🔒",
    };

    const ubicacionesDisplay =
      Object.keys(customUbicaciones).length > 0
        ? customUbicaciones
        : defaultUbicaciones;

    const ubicacionesIcons = restaurante.ubicacionesIcons || defaultIcons;

    // Lista de ubicaciones
    const ubicacionesList = Object.keys(ubicacionesDisplay);

    res.json({
      success: true,
      data: {
        ubicacionesDisplay,
        ubicacionesList,
        ubicacionesIcons,
      },
    });
  } catch (error) {
    console.error("Error en getUbicaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener ubicaciones",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar ubicaciones personalizadas del restaurante
 * @route   PUT /api/ubicaciones
 * @access  Private (Admin)
 */
export const updateUbicaciones = async (req, res) => {
  try {
    const { ubicacionesDisplay, ubicacionesIcons } = req.body;

    if (!ubicacionesDisplay || typeof ubicacionesDisplay !== "object") {
      return res.status(400).json({
        success: false,
        message: "ubicacionesDisplay es requerido y debe ser un objeto",
      });
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar ubicaciones personalizadas
    restaurante.customUbicaciones = ubicacionesDisplay;
    restaurante.ubicacionesIcons = ubicacionesIcons || {};

    await restaurante.save();

    // Lista de ubicaciones
    const ubicacionesList = Object.keys(ubicacionesDisplay);

    res.json({
      success: true,
      message: "Ubicaciones actualizadas exitosamente",
      data: {
        ubicacionesDisplay: restaurante.customUbicaciones,
        ubicacionesList,
        ubicacionesIcons: restaurante.ubicacionesIcons,
      },
    });
  } catch (error) {
    console.error("Error en updateUbicaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar ubicaciones",
      error: error.message,
    });
  }
};
