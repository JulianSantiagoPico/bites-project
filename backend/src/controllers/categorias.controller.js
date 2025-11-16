import Restaurante from "../models/Restaurante.js";

/**
 * @desc    Obtener categorías disponibles del restaurante
 * @route   GET /api/categorias
 * @access  Private
 */
export const getCategorias = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Categorías personalizadas del restaurante o categorías por defecto
    const customCategorias = restaurante.customCategorias || {};

    // Categorías por defecto del sistema
    const defaultCategorias = {
      entradas: "Entradas",
      platos_fuertes: "Platos Fuertes",
      postres: "Postres",
      bebidas: "Bebidas",
      extras: "Extras",
    };

    // Iconos por defecto
    const defaultIcons = {
      entradas: "🥗",
      platos_fuertes: "🍽️",
      postres: "🍰",
      bebidas: "🍹",
      extras: "🍟",
    };

    const categoriasDisplay =
      Object.keys(customCategorias).length > 0
        ? customCategorias
        : defaultCategorias;

    const categoriasIcons = restaurante.categoriasIcons || defaultIcons;

    // Lista de categorías
    const categoriasList = Object.keys(categoriasDisplay);

    res.json({
      success: true,
      data: {
        categoriasDisplay,
        categoriasList,
        categoriasIcons,
      },
    });
  } catch (error) {
    console.error("Error en getCategorias:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar categorías personalizadas del restaurante
 * @route   PUT /api/categorias
 * @access  Private (Admin)
 */
export const updateCategorias = async (req, res) => {
  try {
    const { categoriasDisplay, categoriasIcons } = req.body;

    if (!categoriasDisplay || typeof categoriasDisplay !== "object") {
      return res.status(400).json({
        success: false,
        message: "categoriasDisplay es requerido y debe ser un objeto",
      });
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar categorías personalizadas
    restaurante.customCategorias = categoriasDisplay;
    restaurante.categoriasIcons = categoriasIcons || {};

    await restaurante.save();

    // Lista de categorías
    const categoriasList = Object.keys(categoriasDisplay);

    res.json({
      success: true,
      message: "Categorías actualizadas exitosamente",
      data: {
        categoriasDisplay: restaurante.customCategorias,
        categoriasList,
        categoriasIcons: restaurante.categoriasIcons,
      },
    });
  } catch (error) {
    console.error("Error en updateCategorias:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar categorías",
      error: error.message,
    });
  }
};
