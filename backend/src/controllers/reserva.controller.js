import Reserva from "../models/Reserva.js";
import Mesa from "../models/Mesa.js";

/**
 * @desc    Obtener todas las reservas del restaurante
 * @route   GET /api/reservas
 * @access  Private (Admin, Host)
 */
export const getReservas = async (req, res) => {
  try {
    const { fecha, estado, activo } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por fecha si se proporciona
    if (fecha) {
      const fechaBusqueda = new Date(fecha);
      const fechaInicio = new Date(fechaBusqueda.setHours(0, 0, 0, 0));
      const fechaFin = new Date(fechaBusqueda.setHours(23, 59, 59, 999));
      filter.fecha = { $gte: fechaInicio, $lte: fechaFin };
    }

    // Filtrar por estado si se proporciona
    if (estado && estado !== "Todos") {
      filter.estado = estado.toLowerCase();
    }

    // Filtrar por activo si se proporciona
    if (activo !== undefined) {
      filter.activo = activo === "true";
    }

    const reservas = await Reserva.find(filter)
      .populate("mesaAsignada", "numero ubicacion capacidad")
      .populate("creadoPor", "nombre apellido")
      .populate("modificadoPor", "nombre apellido")
      .sort({ fecha: 1, hora: 1 });

    res.json({
      success: true,
      count: reservas.length,
      data: {
        reservas: reservas.map((reserva) => reserva.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getReservas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las reservas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener una reserva por ID
 * @route   GET /api/reservas/:id
 * @access  Private (Admin, Host)
 */
export const getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    })
      .populate("mesaAsignada", "numero ubicacion capacidad estado")
      .populate("creadoPor", "nombre apellido email")
      .populate("modificadoPor", "nombre apellido email");

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    res.json({
      success: true,
      data: {
        reserva: reserva.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getReservaById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la reserva",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nueva reserva
 * @route   POST /api/reservas
 * @access  Private (Admin, Host)
 */
export const createReserva = async (req, res) => {
  try {
    const {
      nombreCliente,
      telefonoCliente,
      emailCliente,
      fecha,
      hora,
      numeroPersonas,
      mesaAsignada,
      notas,
      ocasion,
    } = req.body;

    // Validar que no exista otra reserva para la misma mesa en el mismo horario
    if (mesaAsignada) {
      const fechaReserva = new Date(fecha);
      const [horas, minutos] = hora.split(":");
      const horaInicio = new Date(fechaReserva);
      horaInicio.setHours(parseInt(horas), parseInt(minutos));

      const conflictoReserva = await Reserva.findOne({
        restauranteId: req.user.restauranteId,
        mesaAsignada,
        fecha: {
          $gte: new Date(fechaReserva.setHours(0, 0, 0, 0)),
          $lte: new Date(fechaReserva.setHours(23, 59, 59, 999)),
        },
        estado: { $in: ["pendiente", "confirmada", "sentada"] },
        activo: true,
      });

      if (conflictoReserva) {
        // Validar si hay conflicto de horario
        const [horasConflicto, minutosConflicto] =
          conflictoReserva.hora.split(":");
        const horaConflicto = new Date(conflictoReserva.fecha);
        horaConflicto.setHours(
          parseInt(horasConflicto),
          parseInt(minutosConflicto)
        );

        const diferenciaHoras =
          Math.abs(horaInicio - horaConflicto) / (1000 * 60 * 60);

        if (diferenciaHoras < 2) {
          return res.status(400).json({
            success: false,
            message: `La mesa ya tiene una reserva a las ${conflictoReserva.hora}. Debe haber al menos 2 horas de diferencia.`,
          });
        }
      }

      // Verificar que la mesa existe y pertenece al restaurante
      const mesa = await Mesa.findOne({
        _id: mesaAsignada,
        restauranteId: req.user.restauranteId,
        activo: true,
      });

      if (!mesa) {
        return res.status(404).json({
          success: false,
          message: "Mesa no encontrada",
        });
      }

      // Verificar capacidad
      if (numeroPersonas > mesa.capacidad) {
        return res.status(400).json({
          success: false,
          message: `La mesa seleccionada tiene capacidad para ${mesa.capacidad} personas`,
        });
      }
    }

    const reserva = await Reserva.create({
      nombreCliente,
      telefonoCliente,
      emailCliente,
      fecha,
      hora,
      numeroPersonas,
      mesaAsignada: mesaAsignada || null,
      notas,
      ocasion: ocasion || "ninguna",
      restauranteId: req.user.restauranteId,
      creadoPor: req.user._id,
    });

    const reservaCreada = await Reserva.findById(reserva._id)
      .populate("mesaAsignada", "numero ubicacion capacidad")
      .populate("creadoPor", "nombre apellido");

    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      data: {
        reserva: reservaCreada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createReserva:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la reserva",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar reserva
 * @route   PUT /api/reservas/:id
 * @access  Private (Admin, Host)
 */
export const updateReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    // No permitir actualizar reservas completadas o canceladas
    if (["completada", "cancelada", "no_show"].includes(reserva.estado)) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede modificar una reserva completada, cancelada o no show",
      });
    }

    const {
      nombreCliente,
      telefonoCliente,
      emailCliente,
      fecha,
      hora,
      numeroPersonas,
      mesaAsignada,
      notas,
      ocasion,
    } = req.body;

    // Si se cambia la mesa, validar disponibilidad
    if (mesaAsignada && mesaAsignada !== reserva.mesaAsignada?.toString()) {
      const fechaReserva = new Date(fecha || reserva.fecha);
      const horaReserva = hora || reserva.hora;
      const [horas, minutos] = horaReserva.split(":");
      const horaInicio = new Date(fechaReserva);
      horaInicio.setHours(parseInt(horas), parseInt(minutos));

      const conflictoReserva = await Reserva.findOne({
        _id: { $ne: reserva._id }, // Excluir la reserva actual
        restauranteId: req.user.restauranteId,
        mesaAsignada,
        fecha: {
          $gte: new Date(fechaReserva.setHours(0, 0, 0, 0)),
          $lte: new Date(fechaReserva.setHours(23, 59, 59, 999)),
        },
        estado: { $in: ["pendiente", "confirmada", "sentada"] },
        activo: true,
      });

      if (conflictoReserva) {
        const [horasConflicto, minutosConflicto] =
          conflictoReserva.hora.split(":");
        const horaConflicto = new Date(conflictoReserva.fecha);
        horaConflicto.setHours(
          parseInt(horasConflicto),
          parseInt(minutosConflicto)
        );

        const diferenciaHoras =
          Math.abs(horaInicio - horaConflicto) / (1000 * 60 * 60);

        if (diferenciaHoras < 2) {
          return res.status(400).json({
            success: false,
            message: `La mesa ya tiene una reserva a las ${conflictoReserva.hora}`,
          });
        }
      }

      const mesa = await Mesa.findOne({
        _id: mesaAsignada,
        restauranteId: req.user.restauranteId,
        activo: true,
      });

      if (!mesa) {
        return res.status(404).json({
          success: false,
          message: "Mesa no encontrada",
        });
      }

      const personas = numeroPersonas || reserva.numeroPersonas;
      if (personas > mesa.capacidad) {
        return res.status(400).json({
          success: false,
          message: `La mesa seleccionada tiene capacidad para ${mesa.capacidad} personas`,
        });
      }
    }

    // Actualizar campos
    if (nombreCliente !== undefined) reserva.nombreCliente = nombreCliente;
    if (telefonoCliente !== undefined)
      reserva.telefonoCliente = telefonoCliente;
    if (emailCliente !== undefined) reserva.emailCliente = emailCliente;
    if (fecha !== undefined) reserva.fecha = fecha;
    if (hora !== undefined) reserva.hora = hora;
    if (numeroPersonas !== undefined) reserva.numeroPersonas = numeroPersonas;
    if (mesaAsignada !== undefined) reserva.mesaAsignada = mesaAsignada || null;
    if (notas !== undefined) reserva.notas = notas;
    if (ocasion !== undefined) reserva.ocasion = ocasion;

    reserva.modificadoPor = req.user._id;
    await reserva.save();

    const reservaActualizada = await Reserva.findById(reserva._id)
      .populate("mesaAsignada", "numero ubicacion capacidad")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: "Reserva actualizada exitosamente",
      data: {
        reserva: reservaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateReserva:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reserva",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar reserva (soft delete)
 * @route   DELETE /api/reservas/:id
 * @access  Private (Admin, Host)
 */
export const deleteReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    reserva.activo = false;
    reserva.modificadoPor = req.user._id;
    await reserva.save();

    res.json({
      success: true,
      message: "Reserva eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteReserva:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reserva",
      error: error.message,
    });
  }
};

/**
 * @desc    Cambiar estado de la reserva
 * @route   PATCH /api/reservas/:id/estado
 * @access  Private (Admin, Host)
 */
export const changeEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    const reserva = await Reserva.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    if (!reserva.activo) {
      return res.status(400).json({
        success: false,
        message: "No se puede cambiar el estado de una reserva inactiva",
      });
    }

    // Validar transiciones de estado permitidas
    const transicionesPermitidas = {
      pendiente: ["confirmada", "cancelada"],
      confirmada: ["sentada", "no_show", "cancelada"],
      sentada: ["completada"],
      completada: [],
      cancelada: [],
      no_show: [],
    };

    if (!transicionesPermitidas[reserva.estado]?.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: `No se puede cambiar de ${reserva.estado} a ${estado}`,
      });
    }

    // Si la reserva pasa a "sentada", actualizar el estado de la mesa a "ocupada"
    if (estado === "sentada" && reserva.mesaAsignada) {
      const mesa = await Mesa.findById(reserva.mesaAsignada);
      if (mesa && mesa.estado !== "ocupada") {
        mesa.estado = "ocupada";
        mesa.modificadoPor = req.user._id;
        await mesa.save();
      }
    }

    // Si la reserva se completa, liberar la mesa
    if (estado === "completada" && reserva.mesaAsignada) {
      const mesa = await Mesa.findById(reserva.mesaAsignada);
      if (mesa && mesa.estado === "ocupada") {
        mesa.estado = "en_limpieza";
        mesa.modificadoPor = req.user._id;
        await mesa.save();
      }
    }

    reserva.estado = estado;
    reserva.modificadoPor = req.user._id;
    await reserva.save();

    const reservaActualizada = await Reserva.findById(reserva._id)
      .populate("mesaAsignada", "numero ubicacion capacidad estado")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: "Estado de la reserva actualizado exitosamente",
      data: {
        reserva: reservaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en changeEstado:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado de la reserva",
      error: error.message,
    });
  }
};

/**
 * @desc    Asignar mesa a una reserva
 * @route   PATCH /api/reservas/:id/asignar-mesa
 * @access  Private (Admin, Host)
 */
export const asignarMesa = async (req, res) => {
  try {
    const { mesaId } = req.body;

    const reserva = await Reserva.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!reserva) {
      return res.status(404).json({
        success: false,
        message: "Reserva no encontrada",
      });
    }

    // Validar que la reserva esté activa
    if (!reserva.activo) {
      return res.status(400).json({
        success: false,
        message: "No se puede asignar mesa a una reserva inactiva",
      });
    }

    // Si se está desasignando la mesa
    if (!mesaId) {
      reserva.mesaAsignada = null;
      reserva.modificadoPor = req.user._id;
      await reserva.save();

      const reservaActualizada = await Reserva.findById(reserva._id).populate(
        "modificadoPor",
        "nombre apellido"
      );

      return res.json({
        success: true,
        message: "Mesa desasignada exitosamente",
        data: {
          reserva: reservaActualizada.toPublicJSON(),
        },
      });
    }

    // Verificar que la mesa existe
    const mesa = await Mesa.findOne({
      _id: mesaId,
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    // Verificar capacidad
    if (reserva.numeroPersonas > mesa.capacidad) {
      return res.status(400).json({
        success: false,
        message: `La mesa tiene capacidad para ${mesa.capacidad} personas, se necesitan ${reserva.numeroPersonas} lugares`,
      });
    }

    // Verificar disponibilidad en el horario
    const fechaReserva = new Date(reserva.fecha);
    const [horas, minutos] = reserva.hora.split(":");
    const horaInicio = new Date(fechaReserva);
    horaInicio.setHours(parseInt(horas), parseInt(minutos));

    const conflictoReserva = await Reserva.findOne({
      _id: { $ne: reserva._id },
      restauranteId: req.user.restauranteId,
      mesaAsignada: mesaId,
      fecha: {
        $gte: new Date(fechaReserva.setHours(0, 0, 0, 0)),
        $lte: new Date(fechaReserva.setHours(23, 59, 59, 999)),
      },
      estado: { $in: ["pendiente", "confirmada", "sentada"] },
      activo: true,
    });

    if (conflictoReserva) {
      const [horasConflicto, minutosConflicto] =
        conflictoReserva.hora.split(":");
      const horaConflicto = new Date(conflictoReserva.fecha);
      horaConflicto.setHours(
        parseInt(horasConflicto),
        parseInt(minutosConflicto)
      );

      const diferenciaHoras =
        Math.abs(horaInicio - horaConflicto) / (1000 * 60 * 60);

      if (diferenciaHoras < 2) {
        return res.status(400).json({
          success: false,
          message: `La mesa ya tiene una reserva a las ${conflictoReserva.hora}`,
        });
      }
    }

    reserva.mesaAsignada = mesaId;
    reserva.modificadoPor = req.user._id;
    await reserva.save();

    const reservaActualizada = await Reserva.findById(reserva._id)
      .populate("mesaAsignada", "numero ubicacion capacidad")
      .populate("modificadoPor", "nombre apellido");

    res.json({
      success: true,
      message: "Mesa asignada exitosamente",
      data: {
        reserva: reservaActualizada.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en asignarMesa:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de reservas
 * @route   GET /api/reservas/estadisticas
 * @access  Private (Admin, Host)
 */
export const getEstadisticas = async (req, res) => {
  try {
    const reservas = await Reserva.find({
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const estadisticas = {
      total: reservas.length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
      sentadas: reservas.filter((r) => r.estado === "sentada").length,
      completadas: reservas.filter((r) => r.estado === "completada").length,
      canceladas: reservas.filter((r) => r.estado === "cancelada").length,
      noShow: reservas.filter((r) => r.estado === "no_show").length,
      hoy: reservas.filter((r) => {
        const fechaReserva = new Date(r.fecha);
        fechaReserva.setHours(0, 0, 0, 0);
        return fechaReserva.getTime() === hoy.getTime();
      }).length,
      manana: reservas.filter((r) => {
        const fechaReserva = new Date(r.fecha);
        fechaReserva.setHours(0, 0, 0, 0);
        return fechaReserva.getTime() === manana.getTime();
      }).length,
      totalPersonas: reservas
        .filter((r) =>
          ["pendiente", "confirmada", "sentada"].includes(r.estado)
        )
        .reduce((sum, r) => sum + r.numeroPersonas, 0),
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

export default {
  getReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva,
  changeEstado,
  asignarMesa,
  getEstadisticas,
};
