import Mesa from "../models/Mesa.js";
import User from "../models/User.js";

/**
 * @desc    Obtener todas las mesas del restaurante
 * @route   GET /api/mesas
 * @access  Private
 */
export const getMesas = async (req, res) => {
  try {
    const { ubicacion, estado, activo } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por ubicación si se proporciona
    if (ubicacion && ubicacion !== "Todas") {
      filter.ubicacion = ubicacion;
    }

    // Filtrar por estado si se proporciona
    if (estado && estado !== "Todos") {
      filter.estado = estado;
    }

    // Filtrar por activo si se proporciona
    if (activo !== undefined) {
      filter.activo = activo === "true";
    }

    const mesas = await Mesa.find(filter)
      .populate("meseroAsignado", "nombre apellido email")
      .populate("creadoPor", "nombre apellido")
      .populate("modificadoPor", "nombre apellido")
      .sort({ numero: 1 });

    res.json({
      success: true,
      count: mesas.length,
      data: {
        mesas: mesas.map((mesa) => mesa.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getMesas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las mesas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener una mesa por ID
 * @route   GET /api/mesas/:id
 * @access  Private
 */
export const getMesaById = async (req, res) => {
  try {
    const mesa = await Mesa.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    })
      .populate("meseroAsignado", "nombre apellido email telefono")
      .populate("creadoPor", "nombre apellido")
      .populate("modificadoPor", "nombre apellido");

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    res.json({
      success: true,
      data: {
        mesa: mesa.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getMesaById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nueva mesa
 * @route   POST /api/mesas
 * @access  Private (Admin)
 */
export const createMesa = async (req, res) => {
  try {
    const { numero, capacidad, ubicacion, estado, notas } = req.body;

    // Verificar si ya existe una mesa con ese número en el restaurante
    const mesaExistente = await Mesa.findOne({
      numero,
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    if (mesaExistente) {
      return res.status(400).json({
        success: false,
        message: `Ya existe una mesa con el número ${numero}`,
      });
    }

    // Crear nueva mesa
    const mesa = await Mesa.create({
      numero,
      capacidad,
      ubicacion,
      estado: estado || "disponible",
      notas,
      restauranteId: req.user.restauranteId,
      creadoPor: req.user._id,
    });

    const mesaPopulated = await Mesa.findById(mesa._id)
      .populate("creadoPor", "nombre apellido")
      .populate("meseroAsignado", "nombre apellido email");

    res.status(201).json({
      success: true,
      message: "Mesa creada exitosamente",
      data: {
        mesa: mesaPopulated.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createMesa:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar mesa
 * @route   PUT /api/mesas/:id
 * @access  Private (Admin)
 */
export const updateMesa = async (req, res) => {
  try {
    const { numero, capacidad, ubicacion, notas } = req.body;

    // Buscar mesa
    const mesa = await Mesa.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    // Si se está cambiando el número, verificar que no exista otro
    if (numero && numero !== mesa.numero) {
      const mesaConMismoNumero = await Mesa.findOne({
        numero,
        restauranteId: req.user.restauranteId,
        activo: true,
        _id: { $ne: mesa._id },
      });

      if (mesaConMismoNumero) {
        return res.status(400).json({
          success: false,
          message: `Ya existe una mesa con el número ${numero}`,
        });
      }

      mesa.numero = numero;
    }

    // Actualizar campos
    if (capacidad !== undefined) mesa.capacidad = capacidad;
    if (ubicacion) mesa.ubicacion = ubicacion;
    if (notas !== undefined) mesa.notas = notas;

    mesa.modificadoPor = req.user._id;

    await mesa.save();

    const mesaActualizada = await Mesa.findById(mesa._id)
      .populate("meseroAsignado", "nombre apellido email")
      .populate("creadoPor", "nombre apellido")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: "Mesa actualizada exitosamente",
      data: {
        mesa: mesaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateMesa:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar mesa (soft delete)
 * @route   DELETE /api/mesas/:id
 * @access  Private (Admin)
 */
export const deleteMesa = async (req, res) => {
  try {
    const mesa = await Mesa.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    // No permitir eliminar mesas ocupadas
    if (mesa.estado === "ocupada") {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar una mesa que está ocupada",
      });
    }

    // Soft delete
    mesa.activo = false;
    mesa.modificadoPor = req.user._id;
    await mesa.save();

    res.json({
      success: true,
      message: "Mesa eliminada exitosamente",
      data: {
        mesa: mesa.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en deleteMesa:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Cambiar estado de la mesa
 * @route   PATCH /api/mesas/:id/estado
 * @access  Private (Admin, Mesero, Host)
 */
export const changeEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    const mesa = await Mesa.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    if (!mesa.activo) {
      return res.status(400).json({
        success: false,
        message: "No se puede cambiar el estado de una mesa inactiva",
      });
    }

    // Validar transiciones de estado
    const transicionesPermitidas = {
      disponible: ["ocupada", "reservada", "en_limpieza"],
      ocupada: ["en_limpieza"],
      reservada: ["disponible", "ocupada"],
      en_limpieza: ["disponible"],
    };

    if (!transicionesPermitidas[mesa.estado]?.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `No se puede cambiar de ${mesa.estado} a ${estado}`,
      });
    }

    mesa.estado = estado;
    mesa.modificadoPor = req.user._id;
    await mesa.save();

    const mesaActualizada = await Mesa.findById(mesa._id)
      .populate("meseroAsignado", "nombre apellido email")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: "Estado de la mesa actualizado exitosamente",
      data: {
        mesa: mesaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en changeEstado:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado de la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Asignar mesero a una mesa
 * @route   PATCH /api/mesas/:id/asignar
 * @access  Private (Admin, Host)
 */
export const asignarMesero = async (req, res) => {
  try {
    const { meseroId } = req.body;

    const mesa = await Mesa.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    if (!mesa.activo) {
      return res.status(400).json({
        success: false,
        message: "No se puede asignar mesero a una mesa inactiva",
      });
    }

    // Si se proporciona meseroId, verificar que existe y es mesero
    if (meseroId) {
      const mesero = await User.findOne({
        _id: meseroId,
        rol: "mesero",
        activo: true,
        restauranteId: req.user.restauranteId,
      });

      if (!mesero) {
        return res.status(404).json({
          success: false,
          message: "Mesero no encontrado o no es válido",
        });
      }

      mesa.meseroAsignado = meseroId;
    } else {
      // Si no se proporciona meseroId, desasignar
      mesa.meseroAsignado = null;
    }

    mesa.modificadoPor = req.user._id;
    await mesa.save();

    const mesaActualizada = await Mesa.findById(mesa._id)
      .populate("meseroAsignado", "nombre apellido email telefono")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: meseroId
        ? "Mesero asignado exitosamente"
        : "Mesero desasignado exitosamente",
      data: {
        mesa: mesaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en asignarMesero:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar mesero",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de mesas
 * @route   GET /api/mesas/estadisticas
 * @access  Private
 */
export const getEstadisticas = async (req, res) => {
  try {
    const mesas = await Mesa.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    const estadisticas = {
      total: mesas.length,
      disponibles: mesas.filter((m) => m.estado === "disponible").length,
      ocupadas: mesas.filter((m) => m.estado === "ocupada").length,
      reservadas: mesas.filter((m) => m.estado === "reservada").length,
      enLimpieza: mesas.filter((m) => m.estado === "en_limpieza").length,
      capacidadTotal: mesas.reduce((sum, m) => sum + m.capacidad, 0),
      porUbicacion: {
        Interior: mesas.filter((m) => m.ubicacion === "Interior").length,
        Terraza: mesas.filter((m) => m.ubicacion === "Terraza").length,
        Bar: mesas.filter((m) => m.ubicacion === "Bar").length,
        VIP: mesas.filter((m) => m.ubicacion === "VIP").length,
      },
      tasaOcupacion:
        mesas.length > 0
          ? (
              (mesas.filter((m) => m.estado === "ocupada").length /
                mesas.length) *
              100
            ).toFixed(1)
          : 0,
    };

    res.json({
      success: true,
      data: {
        estadisticas,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener mesas disponibles
 * @route   GET /api/mesas/disponibles
 * @access  Private
 */
export const getMesasDisponibles = async (req, res) => {
  try {
    const { capacidadMinima } = req.query;

    const filter = {
      restauranteId: req.user.restauranteId,
      estado: "disponible",
      activo: true,
    };

    // Filtrar por capacidad mínima si se proporciona
    if (capacidadMinima) {
      filter.capacidad = { $gte: parseInt(capacidadMinima) };
    }

    const mesas = await Mesa.find(filter)
      .populate("meseroAsignado", "nombre apellido")
      .sort({ numero: 1 });

    res.json({
      success: true,
      count: mesas.length,
      data: {
        mesas: mesas.map((mesa) => mesa.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getMesasDisponibles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener mesas disponibles",
      error: error.message,
    });
  }
};
