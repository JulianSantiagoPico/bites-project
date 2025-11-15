import Pedido from "../models/Pedido.js";
import Mesa from "../models/Mesa.js";
import Producto from "../models/Producto.js";

/**
 * @desc    Obtener todos los pedidos del restaurante
 * @route   GET /api/pedidos
 * @access  Private
 */
export const getPedidos = async (req, res) => {
  try {
    const { estado, mesaId, meseroId, fecha, activo } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por estado
    if (estado && estado !== "Todos") {
      filter.estado = estado;
    }

    // Filtrar por mesa
    if (mesaId) {
      filter.mesaId = mesaId;
    }

    // Filtrar por mesero
    if (meseroId) {
      filter.meseroId = meseroId;
    }

    // Filtrar por activo
    if (activo !== undefined) {
      filter.activo = activo === "true";
    }

    // Filtrar por fecha
    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: fechaInicio,
        $lte: fechaFin,
      };
    }

    const pedidos = await Pedido.find(filter)
      .populate("mesaId", "numero ubicacion")
      .populate("meseroId", "nombre apellido")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pedidos.length,
      data: {
        pedidos: pedidos.map((pedido) => pedido.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getPedidos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los pedidos",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener un pedido por ID
 * @route   GET /api/pedidos/:id
 * @access  Private
 */
export const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    })
      .populate("mesaId", "numero ubicacion capacidad")
      .populate("meseroId", "nombre apellido email")
      .populate("items.productoId", "nombre categoria imagen");

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getPedidoById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el pedido",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener pedidos por mesa
 * @route   GET /api/pedidos/mesa/:mesaId
 * @access  Private
 */
export const getPedidosByMesa = async (req, res) => {
  try {
    const { mesaId } = req.params;

    // Verificar que la mesa existe y pertenece al restaurante
    const mesa = await Mesa.findOne({
      _id: mesaId,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    const pedidos = await Pedido.find({
      mesaId,
      restauranteId: req.user.restauranteId,
      activo: true,
    })
      .populate("meseroId", "nombre apellido")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pedidos.length,
      data: {
        pedidos: pedidos.map((pedido) => pedido.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getPedidosByMesa:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los pedidos de la mesa",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nuevo pedido
 * @route   POST /api/pedidos
 * @access  Private (Admin, Mesero)
 */
export const createPedido = async (req, res) => {
  try {
    const { mesaId, items, nombreCliente, notas, propina } = req.body;

    // Validar que la mesa existe y está disponible
    const mesa = await Mesa.findOne({
      _id: mesaId,
      restauranteId: req.user.restauranteId,
    });

    if (!mesa) {
      return res.status(404).json({
        success: false,
        message: "Mesa no encontrada",
      });
    }

    // Validar que hay items en el pedido
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El pedido debe tener al menos un producto",
      });
    }

    // Validar y procesar items
    const itemsProcessed = [];
    for (const item of items) {
      const producto = await Producto.findOne({
        _id: item.productoId,
        restauranteId: req.user.restauranteId,
      });

      if (!producto) {
        return res.status(404).json({
          success: false,
          message: `Producto ${item.productoId} no encontrado`,
        });
      }

      if (!producto.disponible || !producto.activo) {
        return res.status(400).json({
          success: false,
          message: `El producto "${producto.nombre}" no está disponible`,
        });
      }

      itemsProcessed.push({
        productoId: producto._id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        notas: item.notas || null,
      });
    }

    // Generar número de pedido único
    const numeroPedido = await Pedido.generarNumeroPedido(
      req.user.restauranteId
    );

    // Calcular subtotales de items
    itemsProcessed.forEach((item) => {
      item.subtotal = item.cantidad * item.precioUnitario;
    });

    // Calcular totales del pedido
    const subtotal = itemsProcessed.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    const impuestos = 0; // Los impuestos se pueden calcular según necesidad
    const propinaValue = propina || 0;
    const total = subtotal + impuestos + propinaValue;

    // Crear el pedido
    const pedido = await Pedido.create({
      numeroPedido,
      mesaId,
      meseroId: req.user._id,
      items: itemsProcessed,
      subtotal,
      impuestos,
      propina: propinaValue,
      total,
      nombreCliente: nombreCliente?.trim() || null,
      notas: notas?.trim() || null,
      restauranteId: req.user.restauranteId,
      creadoPor: req.user._id,
      estado: "pendiente",
    });

    // Actualizar estado de la mesa a ocupada si no lo está
    if (mesa.estado === "disponible") {
      mesa.estado = "ocupada";
      await mesa.save();
    }

    // Poblar datos para respuesta
    await pedido.populate("mesaId", "numero ubicacion");
    await pedido.populate("meseroId", "nombre apellido");

    res.status(201).json({
      success: true,
      message: "Pedido creado exitosamente",
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createPedido:", error);

    // Errores de validación de Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al crear el pedido",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar pedido
 * @route   PUT /api/pedidos/:id
 * @access  Private (Admin, Mesero propietario)
 */
export const updatePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
    }

    // Solo se pueden editar pedidos en estado pendiente
    if (pedido.estado !== "pendiente") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden editar pedidos en estado pendiente",
      });
    }

    const { items, nombreCliente, notas, propina } = req.body;

    // Actualizar items si se proporcionan
    if (items && items.length > 0) {
      const itemsProcessed = [];
      for (const item of items) {
        const producto = await Producto.findOne({
          _id: item.productoId,
          restauranteId: req.user.restauranteId,
        });

        if (!producto) {
          return res.status(404).json({
            success: false,
            message: `Producto ${item.productoId} no encontrado`,
          });
        }

        if (!producto.disponible || !producto.activo) {
          return res.status(400).json({
            success: false,
            message: `El producto "${producto.nombre}" no está disponible`,
          });
        }

        itemsProcessed.push({
          productoId: producto._id,
          nombre: producto.nombre,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          notas: item.notas || null,
        });
      }

      pedido.items = itemsProcessed;
    }

    // Actualizar otros campos
    if (nombreCliente !== undefined) {
      pedido.nombreCliente = nombreCliente?.trim() || null;
    }

    if (notas !== undefined) {
      pedido.notas = notas?.trim() || null;
    }

    if (propina !== undefined) {
      pedido.propina = propina;
    }

    pedido.modificadoPor = req.user._id;

    await pedido.save();

    // Poblar datos para respuesta
    await pedido.populate("mesaId", "numero ubicacion");
    await pedido.populate("meseroId", "nombre apellido");

    res.json({
      success: true,
      message: "Pedido actualizado exitosamente",
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updatePedido:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        path: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Error de validación",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar el pedido",
      error: error.message,
    });
  }
};

/**
 * @desc    Cambiar estado del pedido
 * @route   PATCH /api/pedidos/:id/estado
 * @access  Private (Admin, Mesero, Cocinero)
 */
export const changeEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    const pedido = await Pedido.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
    }

    // Validar transiciones de estado
    const estadosValidos = [
      "pendiente",
      "en_preparacion",
      "listo",
      "entregado",
      "cancelado",
    ];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: "Estado no válido",
      });
    }

    // No permitir cambios si ya está cancelado o entregado
    if (pedido.estado === "cancelado" || pedido.estado === "entregado") {
      return res.status(400).json({
        success: false,
        message: `No se puede cambiar el estado de un pedido ${pedido.estado}`,
      });
    }

    pedido.estado = estado;
    pedido.modificadoPor = req.user._id;

    await pedido.save();

    // Si el pedido se entrega, verificar si liberar la mesa
    if (estado === "entregado") {
      // Verificar si hay más pedidos activos para esta mesa
      const pedidosActivos = await Pedido.countDocuments({
        mesaId: pedido.mesaId,
        restauranteId: req.user.restauranteId,
        estado: { $nin: ["entregado", "cancelado"] },
        _id: { $ne: pedido._id },
      });

      // Si no hay más pedidos activos, liberar la mesa
      if (pedidosActivos === 0) {
        await Mesa.findByIdAndUpdate(pedido.mesaId, {
          estado: "disponible",
        });
      }
    }

    // Poblar datos para respuesta
    await pedido.populate("mesaId", "numero ubicacion");
    await pedido.populate("meseroId", "nombre apellido");

    res.json({
      success: true,
      message: `Pedido marcado como ${estado}`,
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en changeEstado:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar el estado del pedido",
      error: error.message,
    });
  }
};

/**
 * @desc    Cancelar pedido (soft delete)
 * @route   DELETE /api/pedidos/:id
 * @access  Private (Admin, Mesero propietario)
 */
export const cancelPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!pedido) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado",
      });
    }

    // Solo se pueden cancelar pedidos que no estén entregados
    if (pedido.estado === "entregado") {
      return res.status(400).json({
        success: false,
        message: "No se puede cancelar un pedido ya entregado",
      });
    }

    pedido.estado = "cancelado";
    pedido.activo = false;
    pedido.modificadoPor = req.user._id;

    await pedido.save();

    // Verificar si liberar la mesa
    const pedidosActivos = await Pedido.countDocuments({
      mesaId: pedido.mesaId,
      restauranteId: req.user.restauranteId,
      estado: { $nin: ["entregado", "cancelado"] },
      _id: { $ne: pedido._id },
    });

    if (pedidosActivos === 0) {
      await Mesa.findByIdAndUpdate(pedido.mesaId, {
        estado: "disponible",
      });
    }

    res.json({
      success: true,
      message: "Pedido cancelado exitosamente",
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en cancelPedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al cancelar el pedido",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de pedidos
 * @route   GET /api/pedidos/estadisticas
 * @access  Private
 */
export const getEstadisticas = async (req, res) => {
  try {
    const { fecha } = req.query;

    // Construir filtro base
    const filter = {
      restauranteId: req.user.restauranteId,
      activo: true,
    };

    // Filtrar por fecha si se proporciona
    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fecha);
      fechaFin.setHours(23, 59, 59, 999);

      filter.createdAt = {
        $gte: fechaInicio,
        $lte: fechaFin,
      };
    }

    const pedidos = await Pedido.find(filter);

    // Calcular estadísticas
    const stats = {
      totalPedidos: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === "pendiente").length,
      enPreparacion: pedidos.filter((p) => p.estado === "en_preparacion")
        .length,
      listos: pedidos.filter((p) => p.estado === "listo").length,
      entregados: pedidos.filter((p) => p.estado === "entregado").length,
      cancelados: pedidos.filter((p) => p.estado === "cancelado").length,
      ventasTotal: pedidos
        .filter((p) => p.estado === "entregado")
        .reduce((sum, p) => sum + p.total, 0),
      propinaTotal: pedidos
        .filter((p) => p.estado === "entregado")
        .reduce((sum, p) => sum + (p.propina || 0), 0),
      ticketPromedio:
        pedidos.filter((p) => p.estado === "entregado").length > 0
          ? pedidos
              .filter((p) => p.estado === "entregado")
              .reduce((sum, p) => sum + p.total, 0) /
            pedidos.filter((p) => p.estado === "entregado").length
          : 0,
    };

    res.json({
      success: true,
      data: {
        stats,
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
