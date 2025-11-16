import Pedido from "../models/Pedido.js";
import { emitCambioEstado } from "../sockets/pedidoSocket.js";

/**
 * @desc    Obtener pedidos para cocina (pendientes y en preparación)
 * @route   GET /api/cocina/pedidos
 * @access  Private (Cocinero, Admin)
 */
export const getPedidosCocina = async (req, res) => {
  try {
    const { estado } = req.query;

    // Filtro base para cocina: solo pedidos activos que requieren preparación
    const filter = {
      restauranteId: req.user.restauranteId,
      activo: true,
    };

    // Filtrar por estado específico o mostrar pendientes y en preparación
    if (estado && estado !== "Todos") {
      filter.estado = estado;
    } else {
      // Por defecto, mostrar pedidos pendientes y en preparación
      filter.estado = { $in: ["pendiente", "en_preparacion"] };
    }

    const pedidos = await Pedido.find(filter)
      .populate("mesaId", "numero ubicacion")
      .populate("meseroId", "nombre apellido")
      .populate("items.productoId", "categoria imagen")
      .sort({ createdAt: 1 }); // Ordenar por más antiguos primero

    // Calcular tiempo de espera para cada pedido
    const pedidosConTiempo = pedidos.map((pedido) => {
      const pedidoJSON = pedido.toPublicJSON();
      const tiempoEspera = Math.floor(
        (Date.now() - new Date(pedido.createdAt).getTime()) / 60000
      ); // En minutos

      return {
        ...pedidoJSON,
        tiempoEspera,
        prioridad:
          tiempoEspera > 30 ? "alta" : tiempoEspera > 15 ? "media" : "normal",
      };
    });

    res.json({
      success: true,
      count: pedidosConTiempo.length,
      data: {
        pedidos: pedidosConTiempo,
      },
    });
  } catch (error) {
    console.error("Error en getPedidosCocina:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos de cocina",
      error: error.message,
    });
  }
};

/**
 * @desc    Iniciar preparación de un pedido (cambiar a en_preparacion)
 * @route   PATCH /api/cocina/pedidos/:id/comenzar
 * @access  Private (Cocinero, Admin)
 */
export const comenzarPreparacion = async (req, res) => {
  try {
    // Validar que el ID es válido
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "ID de pedido inválido",
      });
    }

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

    // Solo se puede comenzar un pedido pendiente
    if (pedido.estado !== "pendiente") {
      return res.status(400).json({
        success: false,
        message: `No se puede comenzar un pedido en estado ${pedido.estado}`,
      });
    }

    const estadoAnterior = pedido.estado;
    pedido.estado = "en_preparacion";
    pedido.modificadoPor = req.user._id;

    await pedido.save();

    // Poblar datos para respuesta
    await pedido.populate("mesaId", "numero ubicacion");
    await pedido.populate("meseroId", "nombre apellido");
    await pedido.populate("items.productoId", "categoria imagen");

    // Emitir evento via WebSocket
    const io = req.app.get("io");
    if (io) {
      emitCambioEstado(
        io,
        req.user.restauranteId.toString(),
        pedido.toPublicJSON(),
        estadoAnterior
      );
    }

    res.json({
      success: true,
      message: "Preparación iniciada",
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en comenzarPreparacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar preparación",
      error: error.message,
    });
  }
};

/**
 * @desc    Marcar pedido como listo
 * @route   PATCH /api/cocina/pedidos/:id/terminar
 * @access  Private (Cocinero, Admin)
 */
export const terminarPreparacion = async (req, res) => {
  try {
    // Validar que el ID es válido
    if (!req.params.id || req.params.id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "ID de pedido inválido",
      });
    }

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

    // Solo se puede terminar un pedido en preparación
    if (pedido.estado !== "en_preparacion") {
      return res.status(400).json({
        success: false,
        message: `No se puede terminar un pedido en estado ${pedido.estado}`,
      });
    }

    const estadoAnterior = pedido.estado;
    pedido.estado = "listo";
    pedido.modificadoPor = req.user._id;

    await pedido.save();

    // Poblar datos para respuesta
    await pedido.populate("mesaId", "numero ubicacion");
    await pedido.populate("meseroId", "nombre apellido");
    await pedido.populate("items.productoId", "categoria imagen");

    // Emitir evento via WebSocket
    const io = req.app.get("io");
    if (io) {
      emitCambioEstado(
        io,
        req.user.restauranteId.toString(),
        pedido.toPublicJSON(),
        estadoAnterior
      );
    }

    res.json({
      success: true,
      message: "Pedido listo para servir",
      data: {
        pedido: pedido.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en terminarPreparacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al terminar preparación",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de cocina
 * @route   GET /api/cocina/estadisticas
 * @access  Private (Cocinero, Admin)
 */
export const getEstadisticasCocina = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const filter = {
      restauranteId: req.user.restauranteId,
      activo: true,
      createdAt: {
        $gte: hoy,
        $lt: mañana,
      },
    };

    const [pedidosPendientes, pedidosEnPreparacion, pedidosListosHoy] =
      await Promise.all([
        Pedido.countDocuments({ ...filter, estado: "pendiente" }),
        Pedido.countDocuments({ ...filter, estado: "en_preparacion" }),
        Pedido.countDocuments({ ...filter, estado: "listo" }),
      ]);

    // Obtener pedido más antiguo pendiente
    const pedidoMasAntiguo = await Pedido.findOne({
      restauranteId: req.user.restauranteId,
      activo: true,
      estado: { $in: ["pendiente", "en_preparacion"] },
    }).sort({ createdAt: 1 });

    let tiempoEsperaMasLargo = 0;
    if (pedidoMasAntiguo) {
      tiempoEsperaMasLargo = Math.floor(
        (Date.now() - new Date(pedidoMasAntiguo.createdAt).getTime()) / 60000
      );
    }

    // Calcular tiempo promedio de preparación (pedidos completados hoy)
    const pedidosCompletados = await Pedido.find({
      restauranteId: req.user.restauranteId,
      estado: { $in: ["listo", "entregado"] },
      createdAt: {
        $gte: hoy,
        $lt: mañana,
      },
    });

    let tiempoPromedioPreparacion = 0;
    if (pedidosCompletados.length > 0) {
      const tiempoTotal = pedidosCompletados.reduce((sum, pedido) => {
        const tiempoPreparacion =
          new Date(pedido.updatedAt).getTime() -
          new Date(pedido.createdAt).getTime();
        return sum + tiempoPreparacion;
      }, 0);
      tiempoPromedioPreparacion = Math.floor(
        tiempoTotal / pedidosCompletados.length / 60000
      ); // En minutos
    }

    res.json({
      success: true,
      data: {
        pendientes: pedidosPendientes,
        enPreparacion: pedidosEnPreparacion,
        listosHoy: pedidosListosHoy,
        completadosHoy: pedidosCompletados.length,
        tiempoEsperaMasLargo,
        tiempoPromedioPreparacion,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasCocina:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de cocina",
      error: error.message,
    });
  }
};
