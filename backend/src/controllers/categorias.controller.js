import Categoria from "../models/Categoria.js";

/**
 * @desc    Obtener categorías disponibles del restaurante
 * @route   GET /api/categorias
 * @access  Private
 */
export const getCategorias = async (req, res) => {
  try {
    // Buscar todas las categorías activas del restaurante, ordenadas
    const categorias = await Categoria.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Convertir a formato esperado por el frontend (compatibilidad)
    const categoriasDisplay = {};
    const categoriasIcons = {};
    const categoriasList = [];

    categorias.forEach((cat) => {
      categoriasDisplay[cat.key] = cat.label;
      categoriasIcons[cat.key] = cat.icon;
      categoriasList.push(cat.key);
    });

    res.json({
      success: true,
      data: {
        categoriasDisplay,
        categoriasList,
        categoriasIcons,
        categorias: categorias.map((cat) => ({
          id: cat._id,
          key: cat.key,
          label: cat.label,
          icon: cat.icon,
          orden: cat.orden,
          predefinida: cat.predefinida,
          activo: cat.activo,
        })),
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
 * @desc    Actualizar categorías del restaurante
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

    const restauranteId = req.user.restauranteId;

    // Obtener categorías existentes
    const categoriasExistentes = await Categoria.find({ restauranteId });
    const existentesMap = new Map(
      categoriasExistentes.map((cat) => [cat.key, cat])
    );

    // Operaciones a realizar
    const operaciones = [];
    let orden = 1;

    // Procesar cada categoría del request
    for (const [key, label] of Object.entries(categoriasDisplay)) {
      const icon = categoriasIcons?.[key] || "📦";
      const categoriaExistente = existentesMap.get(key);

      if (categoriaExistente) {
        // Actualizar categoría existente
        operaciones.push(
          Categoria.findByIdAndUpdate(
            categoriaExistente._id,
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
        // Crear nueva categoría
        operaciones.push(
          Categoria.create({
            restauranteId,
            key,
            label,
            icon,
            orden: orden++,
            predefinida: false,
            activo: true,
          })
        );
      }
    }

    // Desactivar categorías que ya no están en la lista (solo las no predefinidas)
    for (const [key, cat] of existentesMap) {
      if (!cat.predefinida) {
        operaciones.push(
          Categoria.findByIdAndUpdate(cat._id, { activo: false }, { new: true })
        );
      }
    }

    // Ejecutar todas las operaciones
    await Promise.all(operaciones);

    // Obtener categorías actualizadas
    const categoriasActualizadas = await Categoria.find({
      restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Formatear respuesta
    const categoriasDisplayResult = {};
    const categoriasIconsResult = {};
    const categoriasListResult = [];

    categoriasActualizadas.forEach((cat) => {
      categoriasDisplayResult[cat.key] = cat.label;
      categoriasIconsResult[cat.key] = cat.icon;
      categoriasListResult.push(cat.key);
    });

    res.json({
      success: true,
      message: "Categorías actualizadas exitosamente",
      data: {
        categoriasDisplay: categoriasDisplayResult,
        categoriasList: categoriasListResult,
        categoriasIcons: categoriasIconsResult,
        categorias: categoriasActualizadas.map((cat) => ({
          id: cat._id,
          key: cat.key,
          label: cat.label,
          icon: cat.icon,
          orden: cat.orden,
          predefinida: cat.predefinida,
          activo: cat.activo,
        })),
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
