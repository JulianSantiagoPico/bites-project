import Restaurante from "../models/Restaurante.js";

/**
 * @desc    Obtener ocasiones disponibles del restaurante
 * @route   GET /api/ocasiones
 * @access  Private
 */
export const getOcasiones = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Ocasiones personalizadas del restaurante o ocasiones por defecto
    const customOcasiones = restaurante.customOcasiones || {};

    // Ocasiones por defecto del sistema
    const defaultOcasiones = {
      cumpleaños: "Cumpleaños",
      aniversario: "Aniversario",
      cita: "Cita",
      negocio: "Negocio",
    };

    // Iconos por defecto
    const defaultIcons = {
      cumpleaños: "🎂",
      aniversario: "💐",
      cita: "💑",
      negocio: "💼",
    };

    const ocasionesDisplay =
      Object.keys(customOcasiones).length > 0
        ? customOcasiones
        : defaultOcasiones;

    const ocasionesIcons = restaurante.ocasionesIcons || defaultIcons;

    // Lista de ocasiones (incluir ninguna y otro siempre)
    const ocasionesList = ["ninguna", ...Object.keys(ocasionesDisplay), "otro"];

    res.json({
      success: true,
      data: {
        ocasionesDisplay,
        ocasionesList,
        ocasionesIcons,
      },
    });
  } catch (error) {
    console.error("Error en getOcasiones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener ocasiones",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar ocasiones personalizadas del restaurante
 * @route   PUT /api/ocasiones
 * @access  Private (Admin)
 */
export const updateOcasiones = async (req, res) => {
  try {
    const { ocasionesDisplay, ocasionesIcons } = req.body;

    if (!ocasionesDisplay || typeof ocasionesDisplay !== "object") {
      return res.status(400).json({
        success: false,
        message: "ocasionesDisplay es requerido y debe ser un objeto",
      });
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar ocasiones personalizadas
    restaurante.customOcasiones = ocasionesDisplay;
    restaurante.ocasionesIcons = ocasionesIcons || {};

    await restaurante.save();

    // Lista de ocasiones
    const ocasionesList = ["ninguna", ...Object.keys(ocasionesDisplay), "otro"];

    res.json({
      success: true,
      message: "Ocasiones actualizadas exitosamente",
      data: {
        ocasionesDisplay: restaurante.customOcasiones,
        ocasionesList,
        ocasionesIcons: restaurante.ocasionesIcons,
      },
    });
  } catch (error) {
    console.error("Error en updateOcasiones:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar ocasiones",
      error: error.message,
    });
  }
};
