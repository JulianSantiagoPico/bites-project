import Ubicacion from "../models/Ubicacion.js";

// Ubicaciones predeterminadas
const DEFAULT_UBICACIONES = [
  { key: "terraza", label: "Terraza", icon: "🌳", orden: 1 },
  { key: "interior", label: "Interior", icon: "🏠", orden: 2 },
  { key: "barra", label: "Barra", icon: "🍺", orden: 3 },
  { key: "vip", label: "VIP", icon: "⭐", orden: 4 },
];

/**
 * @desc    Obtener ubicaciones disponibles del restaurante
 * @route   GET /api/ubicaciones
 * @access  Private
 */
export const getUbicaciones = async (req, res) => {
  try {
    // Buscar todas las ubicaciones del restaurante, ordenadas y solo las activas
    const ubicaciones = await Ubicacion.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    }).sort({ orden: 1, createdAt: 1 });

    // Si no hay ubicaciones, devolver las predeterminadas
    if (ubicaciones.length === 0) {
      const ubicacionesDisplay = {};
      const ubicacionesIcons = {};
      const ubicacionesList = [];

      DEFAULT_UBICACIONES.forEach((ubicacion) => {
        ubicacionesDisplay[ubicacion.key] = ubicacion.label;
        ubicacionesIcons[ubicacion.key] = ubicacion.icon;
        ubicacionesList.push(ubicacion.key);
      });

      return res.json({
        success: true,
        data: {
          ubicacionesDisplay,
          ubicacionesList,
          ubicacionesIcons,
        },
      });
    }

    // Transformar a formato Display, List e Icons
    const ubicacionesDisplay = {};
    const ubicacionesIcons = {};
    const ubicacionesList = [];

    ubicaciones.forEach((ubicacion) => {
      ubicacionesDisplay[ubicacion.key] = ubicacion.label;
      ubicacionesIcons[ubicacion.key] = ubicacion.icon;
      ubicacionesList.push(ubicacion.key);
    });

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
 * @desc    Obtener todas las ubicaciones (activas e inactivas) del restaurante
 * @route   GET /api/ubicaciones/todas
 * @access  Private (Admin)
 */
export const getTodasUbicaciones = async (req, res) => {
  try {
    const ubicaciones = await Ubicacion.find({
      restauranteId: req.user.restauranteId,
    }).sort({ orden: 1, createdAt: 1 });

    res.json({
      success: true,
      data: ubicaciones,
    });
  } catch (error) {
    console.error("Error en getTodasUbicaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todas las ubicaciones",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar ubicaciones del restaurante
 * @route   PUT /api/ubicaciones
 * @access  Private (Admin)
 */
export const updateUbicaciones = async (req, res) => {
  try {
    const { ubicaciones } = req.body;

    if (!Array.isArray(ubicaciones)) {
      return res.status(400).json({
        success: false,
        message: "ubicaciones debe ser un array",
      });
    }

    const restauranteId = req.user.restauranteId;

    // Obtener todas las ubicaciones personalizadas actuales (no predefinidas)
    const ubicacionesActuales = await Ubicacion.find({
      restauranteId,
      predefinida: false,
    });

    // Array de keys que se están enviando
    const keysEnviadas = ubicaciones.map((u) => u.key);

    // Marcar como inactivas las ubicaciones que no están en el array enviado
    const ubicacionesADesactivar = ubicacionesActuales.filter(
      (ubi) => !keysEnviadas.includes(ubi.key)
    );

    for (const ubicacion of ubicacionesADesactivar) {
      await Ubicacion.findByIdAndUpdate(ubicacion._id, {
        activo: false,
      });
    }

    // Procesar cada ubicación recibida
    for (const ubicacion of ubicaciones) {
      const { key, label, icon, orden, activo, _id } = ubicacion;

      if (_id) {
        // Actualizar ubicación existente
        await Ubicacion.findByIdAndUpdate(_id, {
          label,
          icon,
          orden,
          activo,
        });
      } else {
        // Crear nueva ubicación o actualizar si ya existe por key
        await Ubicacion.findOneAndUpdate(
          { restauranteId, key },
          {
            restauranteId,
            key,
            label,
            icon,
            orden,
            activo: activo !== undefined ? activo : true,
            predefinida: false,
          },
          { upsert: true, new: true }
        );
      }
    }

    // Obtener ubicaciones actualizadas (solo activas)
    const ubicacionesActualizadas = await Ubicacion.find({
      restauranteId,
      activo: true,
    }).sort({ orden: 1, createdAt: 1 });

    // Transformar a formato Display, List e Icons
    const ubicacionesDisplay = {};
    const ubicacionesIcons = {};
    const ubicacionesList = [];

    ubicacionesActualizadas.forEach((ubi) => {
      ubicacionesDisplay[ubi.key] = ubi.label;
      ubicacionesIcons[ubi.key] = ubi.icon;
      ubicacionesList.push(ubi.key);
    });

    res.json({
      success: true,
      message: "Ubicaciones actualizadas exitosamente",
      data: {
        ubicacionesDisplay,
        ubicacionesList,
        ubicacionesIcons,
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
