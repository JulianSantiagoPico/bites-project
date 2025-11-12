import Inventario from "../models/Inventario.js";

/**
 * @desc    Obtener todo el inventario del restaurante
 * @route   GET /api/inventario
 * @access  Private
 */
export const getInventario = async (req, res) => {
  try {
    const { categoria, activo } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por categoría si se proporciona
    if (categoria && categoria !== "Todo") {
      filter.categoria = categoria;
    }

    // Filtrar por estado activo si se proporciona
    if (activo !== undefined) {
      filter.activo = activo === "true";
    }

    const items = await Inventario.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: {
        items: items.map((item) => item.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getInventario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el inventario",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener un item del inventario por ID
 * @route   GET /api/inventario/:id
 * @access  Private
 */
export const getItemById = async (req, res) => {
  try {
    const item = await Inventario.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        item: item.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getItemById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el item",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nuevo item en el inventario
 * @route   POST /api/inventario
 * @access  Private (Admin)
 */
export const createItem = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      cantidad,
      unidadMedida,
      cantidadMinima,
      precioUnitario,
      proveedor,
      lote,
      fechaVencimiento,
    } = req.body;

    // Verificar si ya existe un item con el mismo nombre
    const itemExists = await Inventario.findOne({
      nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    if (itemExists) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un item con este nombre en el inventario",
      });
    }

    // Crear el item
    const item = await Inventario.create({
      nombre,
      descripcion,
      categoria,
      cantidad,
      unidadMedida,
      cantidadMinima,
      precioUnitario,
      proveedor,
      lote,
      fechaVencimiento,
      restauranteId: req.user.restauranteId,
      creadoPor: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Item agregado al inventario exitosamente",
      data: {
        item: item.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createItem:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el item",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar item del inventario
 * @route   PUT /api/inventario/:id
 * @access  Private (Admin)
 */
export const updateItem = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      categoria,
      cantidad,
      unidadMedida,
      cantidadMinima,
      precioUnitario,
      proveedor,
      lote,
      fechaVencimiento,
      activo,
    } = req.body;

    const item = await Inventario.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item no encontrado",
      });
    }

    // Si se cambia el nombre, verificar que no exista otro con el mismo
    if (nombre && nombre !== item.nombre) {
      const itemExists = await Inventario.findOne({
        nombre: { $regex: new RegExp(`^${nombre}$`, "i") },
        restauranteId: req.user.restauranteId,
        activo: true,
        _id: { $ne: item._id },
      });

      if (itemExists) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un item con este nombre en el inventario",
        });
      }
    }

    // Actualizar campos
    if (nombre !== undefined) item.nombre = nombre;
    if (descripcion !== undefined) item.descripcion = descripcion;
    if (categoria !== undefined) item.categoria = categoria;
    if (cantidad !== undefined) item.cantidad = cantidad;
    if (unidadMedida !== undefined) item.unidadMedida = unidadMedida;
    if (cantidadMinima !== undefined) item.cantidadMinima = cantidadMinima;
    if (precioUnitario !== undefined) item.precioUnitario = precioUnitario;
    if (proveedor !== undefined) item.proveedor = proveedor;
    if (lote !== undefined) item.lote = lote;
    if (fechaVencimiento !== undefined) item.fechaVencimiento = fechaVencimiento;
    if (activo !== undefined) item.activo = activo;
    
    item.modificadoPor = req.user.id;

    await item.save();

    res.json({
      success: true,
      message: "Item actualizado exitosamente",
      data: {
        item: item.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateItem:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el item",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar item del inventario (soft delete)
 * @route   DELETE /api/inventario/:id
 * @access  Private (Admin)
 */
export const deleteItem = async (req, res) => {
  try {
    const item = await Inventario.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item no encontrado",
      });
    }

    // Soft delete - solo desactivar
    item.activo = false;
    item.modificadoPor = req.user.id;
    await item.save();

    res.json({
      success: true,
      message: "Item desactivado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteItem:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el item",
      error: error.message,
    });
  }
};

/**
 * @desc    Ajustar stock de un item (entrada o salida)
 * @route   POST /api/inventario/:id/ajustar
 * @access  Private (Admin, Cocinero)
 */
export const adjustStock = async (req, res) => {
  try {
    const { cantidad, tipo, motivo } = req.body;

    // Validar tipo
    if (!["entrada", "salida"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de ajuste inválido. Debe ser 'entrada' o 'salida'",
      });
    }

    // Validar cantidad
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        success: false,
        message: "La cantidad debe ser mayor a 0",
      });
    }

    const item = await Inventario.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
      activo: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item no encontrado",
      });
    }

    // Calcular nueva cantidad
    const cantidadAnterior = item.cantidad;
    let nuevaCantidad;

    if (tipo === "entrada") {
      nuevaCantidad = cantidadAnterior + cantidad;
    } else {
      nuevaCantidad = cantidadAnterior - cantidad;
      
      // Validar que no sea negativa
      if (nuevaCantidad < 0) {
        return res.status(400).json({
          success: false,
          message: "No hay suficiente stock para realizar esta salida",
        });
      }
    }

    // Actualizar cantidad
    item.cantidad = nuevaCantidad;
    item.modificadoPor = req.user.id;
    await item.save();

    res.json({
      success: true,
      message: `Stock ajustado exitosamente (${tipo})`,
      data: {
        item: item.toPublicJSON(),
        ajuste: {
          tipo,
          cantidad,
          cantidadAnterior,
          cantidadNueva: nuevaCantidad,
          motivo,
          ajustadoPor: req.user.id,
          fecha: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Error en adjustStock:", error);
    res.status(500).json({
      success: false,
      message: "Error al ajustar el stock",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas del inventario
 * @route   GET /api/inventario/estadisticas
 * @access  Private
 */
export const getEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Inventario.getEstadisticas(
      req.user.restauranteId
    );

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
 * @desc    Obtener alertas del inventario (items con bajo stock, vencimientos, etc.)
 * @route   GET /api/inventario/alertas
 * @access  Private
 */
export const getAlertas = async (req, res) => {
  try {
    const alertas = await Inventario.getAlertas(req.user.restauranteId);

    res.json({
      success: true,
      data: {
        alertas,
      },
    });
  } catch (error) {
    console.error("Error en getAlertas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener alertas",
      error: error.message,
    });
  }
};
