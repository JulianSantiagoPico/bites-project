import Ocasion from "../models/Ocasion.js";

/**
 * @desc    Obtener ocasiones disponibles del restaurante
 * @route   GET /api/ocasiones
 * @access  Private
 */
export const getOcasiones = async (req, res) => {
  try {
    // Buscar todas las ocasiones activas del restaurante, ordenadas
    const ocasiones = await Ocasion.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Convertir a formato esperado por el frontend (compatibilidad)
    const ocasionesDisplay = {};
    const ocasionesIcons = {};

    ocasiones.forEach((ocasion) => {
      ocasionesDisplay[ocasion.key] = ocasion.label;
      ocasionesIcons[ocasion.key] = ocasion.icon;
    });

    // Lista de ocasiones (incluir ninguna y otro siempre)
    const ocasionesList = ["ninguna", ...ocasiones.map((o) => o.key), "otro"];

    res.json({
      success: true,
      data: {
        ocasionesDisplay,
        ocasionesList,
        ocasionesIcons,
        ocasiones: ocasiones.map((oc) => ({
          id: oc._id,
          key: oc.key,
          label: oc.label,
          icon: oc.icon,
          orden: oc.orden,
          predefinida: oc.predefinida,
          activo: oc.activo,
        })),
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
 * @desc    Actualizar ocasiones del restaurante
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

    const restauranteId = req.user.restauranteId;

    // Obtener ocasiones existentes
    const ocasionesExistentes = await Ocasion.find({ restauranteId });
    const existentesMap = new Map(
      ocasionesExistentes.map((oc) => [oc.key, oc])
    );

    // Operaciones a realizar
    const operaciones = [];
    let orden = 1;

    // Procesar cada ocasión del request
    for (const [key, label] of Object.entries(ocasionesDisplay)) {
      const icon = ocasionesIcons?.[key] || "🎉";
      const ocasionExistente = existentesMap.get(key);

      if (ocasionExistente) {
        // Actualizar ocasión existente
        operaciones.push(
          Ocasion.findByIdAndUpdate(
            ocasionExistente._id,
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
        // Crear nueva ocasión
        operaciones.push(
          Ocasion.create({
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

    // Desactivar ocasiones que ya no están en la lista (solo las no predefinidas)
    for (const [key, oc] of existentesMap) {
      if (!oc.predefinida) {
        operaciones.push(
          Ocasion.findByIdAndUpdate(oc._id, { activo: false }, { new: true })
        );
      }
    }

    // Ejecutar todas las operaciones
    await Promise.all(operaciones);

    // Obtener ocasiones actualizadas
    const ocasionesActualizadas = await Ocasion.find({
      restauranteId,
      activo: true,
    }).sort({ orden: 1 });

    // Formatear respuesta
    const ocasionesDisplayResult = {};
    const ocasionesIconsResult = {};

    ocasionesActualizadas.forEach((oc) => {
      ocasionesDisplayResult[oc.key] = oc.label;
      ocasionesIconsResult[oc.key] = oc.icon;
    });

    const ocasionesListResult = [
      "ninguna",
      ...ocasionesActualizadas.map((o) => o.key),
      "otro",
    ];

    res.json({
      success: true,
      message: "Ocasiones actualizadas exitosamente",
      data: {
        ocasionesDisplay: ocasionesDisplayResult,
        ocasionesList: ocasionesListResult,
        ocasionesIcons: ocasionesIconsResult,
        ocasiones: ocasionesActualizadas.map((oc) => ({
          id: oc._id,
          key: oc.key,
          label: oc.label,
          icon: oc.icon,
          orden: oc.orden,
          predefinida: oc.predefinida,
          activo: oc.activo,
        })),
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
