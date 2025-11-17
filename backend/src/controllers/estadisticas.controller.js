import Pedido from "../models/Pedido.js";
import Mesa from "../models/Mesa.js";
import Reserva from "../models/Reserva.js";
import Inventario from "../models/Inventario.js";

/**
 * @desc    Obtener estadísticas generales del dashboard
 * @route   GET /api/estadisticas/generales
 * @access  Private (Admin)
 */
export const getEstadisticasGenerales = async (req, res) => {
  try {
    const { periodo = "hoy" } = req.query;
    const restauranteId = req.user.restauranteId;

    // Calcular rango de fechas según el período
    const { fechaInicio, fechaFin } = calcularRangoFechas(periodo);

    // Consultas paralelas para optimizar rendimiento
    const [pedidos, mesas, pedidosHoy, reservasHoy] = await Promise.all([
      // Pedidos del período
      Pedido.find({
        restauranteId,
        createdAt: { $gte: fechaInicio, $lte: fechaFin },
        activo: true,
      }),
      // Estado actual de mesas
      Mesa.find({ restauranteId, activo: true }),
      // Pedidos activos de hoy
      Pedido.find({
        restauranteId,
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        estado: { $nin: ["entregado", "cancelado"] },
        activo: true,
      }),
      // Reservas de hoy
      Reserva.find({
        restauranteId,
        fecha: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
    ]);

    // Calcular métricas de ventas
    const pedidosEntregados = pedidos.filter((p) => p.estado === "entregado");
    const ventasTotal = pedidosEntregados.reduce((sum, p) => sum + p.total, 0);
    const propinaTotal = pedidosEntregados.reduce(
      (sum, p) => sum + (p.propina || 0),
      0
    );

    // Calcular estadísticas de mesas
    const mesasOcupadas = mesas.filter((m) => m.estado === "ocupada").length;
    const mesasDisponibles = mesas.filter(
      (m) => m.estado === "disponible"
    ).length;
    const porcentajeOcupacion =
      mesas.length > 0 ? ((mesasOcupadas / mesas.length) * 100).toFixed(1) : 0;

    // Calcular cambio respecto al período anterior
    const periodoAnterior = calcularPeriodoAnterior(periodo);
    const pedidosAnterior = await Pedido.find({
      restauranteId,
      createdAt: {
        $gte: periodoAnterior.fechaInicio,
        $lte: periodoAnterior.fechaFin,
      },
      estado: "entregado",
      activo: true,
    });

    const ventasAnterior = pedidosAnterior.reduce((sum, p) => sum + p.total, 0);
    const cambioVentas =
      ventasAnterior > 0
        ? (((ventasTotal - ventasAnterior) / ventasAnterior) * 100).toFixed(1)
        : 0;

    // Calcular ticket promedio
    const ticketPromedio =
      pedidosEntregados.length > 0
        ? (ventasTotal / pedidosEntregados.length).toFixed(2)
        : 0;

    // Estadísticas generales
    const stats = {
      // Ventas
      ventasTotal: ventasTotal.toFixed(2),
      cambioVentas: parseFloat(cambioVentas),
      pedidosCompletados: pedidosEntregados.length,
      ticketPromedio: parseFloat(ticketPromedio),
      propinaTotal: propinaTotal.toFixed(2),

      // Pedidos activos
      pedidosActivos: pedidosHoy.length,
      pedidosPendientes: pedidosHoy.filter((p) => p.estado === "pendiente")
        .length,
      pedidosEnPreparacion: pedidosHoy.filter(
        (p) => p.estado === "en_preparacion"
      ).length,
      pedidosListos: pedidosHoy.filter((p) => p.estado === "listo").length,

      // Mesas
      mesasTotal: mesas.length,
      mesasOcupadas,
      mesasDisponibles,
      porcentajeOcupacion: parseFloat(porcentajeOcupacion),

      // Reservas
      reservasHoy: reservasHoy.length,
      reservasPendientes: reservasHoy.filter((r) => r.estado === "pendiente")
        .length,
      reservasConfirmadas: reservasHoy.filter((r) => r.estado === "confirmada")
        .length,
    };

    res.json({
      success: true,
      data: {
        stats,
        periodo,
        fechaInicio,
        fechaFin,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasGenerales:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas generales",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de ventas detalladas
 * @route   GET /api/estadisticas/ventas
 * @access  Private (Admin)
 */
export const getEstadisticasVentas = async (req, res) => {
  try {
    const { periodo = "mes", fechaInicio, fechaFin } = req.query;
    const restauranteId = req.user.restauranteId;

    // Usar fechas personalizadas o calcular según período
    let rangoFechas;
    if (fechaInicio && fechaFin) {
      rangoFechas = {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      };
    } else {
      rangoFechas = calcularRangoFechas(periodo);
    }

    // Obtener pedidos entregados del período
    const pedidos = await Pedido.find({
      restauranteId,
      createdAt: {
        $gte: rangoFechas.fechaInicio,
        $lte: rangoFechas.fechaFin,
      },
      estado: "entregado",
      activo: true,
    }).sort({ createdAt: 1 });

    // Agrupar ventas por día
    const ventasPorDia = agruparVentasPorDia(pedidos);

    // Agrupar ventas por hora (para identificar horas pico)
    const ventasPorHora = agruparVentasPorHora(pedidos);

    // Calcular métricas
    const ventasTotal = pedidos.reduce((sum, p) => sum + p.total, 0);
    const propinaTotal = pedidos.reduce((sum, p) => sum + (p.propina || 0), 0);
    const ticketPromedio =
      pedidos.length > 0 ? ventasTotal / pedidos.length : 0;

    // Identificar hora pico
    const horaPico = ventasPorHora.reduce(
      (max, hora) => (hora.ventas > max.ventas ? hora : max),
      { hora: "N/A", ventas: 0 }
    );

    // Comparación con período anterior
    const periodoAnterior = calcularPeriodoAnterior(periodo);
    const pedidosAnterior = await Pedido.find({
      restauranteId,
      createdAt: {
        $gte: periodoAnterior.fechaInicio,
        $lte: periodoAnterior.fechaFin,
      },
      estado: "entregado",
      activo: true,
    });

    const ventasAnterior = pedidosAnterior.reduce((sum, p) => sum + p.total, 0);
    const cambioVentas =
      ventasAnterior > 0
        ? (((ventasTotal - ventasAnterior) / ventasAnterior) * 100).toFixed(1)
        : 0;

    res.json({
      success: true,
      data: {
        resumen: {
          ventasTotal: ventasTotal.toFixed(2),
          propinaTotal: propinaTotal.toFixed(2),
          totalPedidos: pedidos.length,
          ticketPromedio: ticketPromedio.toFixed(2),
          cambioVentas: parseFloat(cambioVentas),
        },
        ventasPorDia,
        ventasPorHora,
        horaPico: {
          hora: horaPico.hora,
          ventas: horaPico.ventas.toFixed(2),
        },
        periodo,
        fechaInicio: rangoFechas.fechaInicio,
        fechaFin: rangoFechas.fechaFin,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasVentas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de ventas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de productos
 * @route   GET /api/estadisticas/productos
 * @access  Private (Admin)
 */
export const getEstadisticasProductos = async (req, res) => {
  try {
    const { periodo = "mes", limit = 10 } = req.query;
    const restauranteId = req.user.restauranteId;

    const { fechaInicio, fechaFin } = calcularRangoFechas(periodo);

    // Obtener pedidos entregados del período
    const pedidos = await Pedido.find({
      restauranteId,
      createdAt: { $gte: fechaInicio, $lte: fechaFin },
      estado: "entregado",
      activo: true,
    }).populate("items.productoId", "nombre categoria precio imagen");

    // Calcular estadísticas por producto
    const productosMap = new Map();

    pedidos.forEach((pedido) => {
      pedido.items.forEach((item) => {
        const productoId =
          item.productoId?._id?.toString() || item.productoId?.toString();

        if (!productoId) return;

        if (!productosMap.has(productoId)) {
          productosMap.set(productoId, {
            productoId,
            nombre: item.nombre,
            categoria: item.productoId?.categoria || "Sin categoría",
            imagen: item.productoId?.imagen || "🍽️",
            cantidadVendida: 0,
            ingresos: 0,
            vecesOrdenado: 0,
          });
        }

        const stats = productosMap.get(productoId);
        stats.cantidadVendida += item.cantidad;
        stats.ingresos += item.subtotal;
        stats.vecesOrdenado += 1;
      });
    });

    // Convertir a array y ordenar por ingresos
    const topProductos = Array.from(productosMap.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, parseInt(limit))
      .map((p) => ({
        ...p,
        ingresos: p.ingresos.toFixed(2),
      }));

    // Productos más vendidos por cantidad
    const topPorCantidad = Array.from(productosMap.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, parseInt(limit));

    // Estadísticas por categoría
    const categoriaMap = new Map();
    Array.from(productosMap.values()).forEach((producto) => {
      const categoria = producto.categoria;
      if (!categoriaMap.has(categoria)) {
        categoriaMap.set(categoria, {
          categoria,
          cantidadVendida: 0,
          ingresos: 0,
        });
      }
      const stats = categoriaMap.get(categoria);
      stats.cantidadVendida += producto.cantidadVendida;
      stats.ingresos += parseFloat(producto.ingresos);
    });

    const ventasPorCategoria = Array.from(categoriaMap.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .map((c) => ({
        ...c,
        ingresos: c.ingresos.toFixed(2),
      }));

    res.json({
      success: true,
      data: {
        topProductosPorIngresos: topProductos,
        topProductosPorCantidad: topPorCantidad,
        ventasPorCategoria,
        totalProductosVendidos: Array.from(productosMap.values()).reduce(
          (sum, p) => sum + p.cantidadVendida,
          0
        ),
        periodo,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasProductos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de productos",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de mesas
 * @route   GET /api/estadisticas/mesas
 * @access  Private (Admin)
 */
export const getEstadisticasMesas = async (req, res) => {
  try {
    const { fecha } = req.query;
    const restauranteId = req.user.restauranteId;

    // Si no se proporciona fecha, usar hoy
    const fechaConsulta = fecha ? new Date(fecha) : new Date();
    fechaConsulta.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaConsulta);
    fechaFin.setHours(23, 59, 59, 999);

    // Obtener todas las mesas
    const mesas = await Mesa.find({ restauranteId, activo: true });

    // Obtener pedidos de mesas del día
    const pedidos = await Pedido.find({
      restauranteId,
      createdAt: { $gte: fechaConsulta, $lte: fechaFin },
      activo: true,
    }).populate("mesaId", "numero ubicacion");

    // Estadísticas actuales
    const estadoMesas = {
      total: mesas.length,
      disponibles: mesas.filter((m) => m.estado === "disponible").length,
      ocupadas: mesas.filter((m) => m.estado === "ocupada").length,
      reservadas: mesas.filter((m) => m.estado === "reservada").length,
      enLimpieza: mesas.filter((m) => m.estado === "en_limpieza").length,
    };

    estadoMesas.porcentajeOcupacion =
      estadoMesas.total > 0
        ? ((estadoMesas.ocupadas / estadoMesas.total) * 100).toFixed(1)
        : 0;

    // Análisis por ubicación
    const ubicacionMap = new Map();
    mesas.forEach((mesa) => {
      if (!ubicacionMap.has(mesa.ubicacion)) {
        ubicacionMap.set(mesa.ubicacion, {
          ubicacion: mesa.ubicacion,
          total: 0,
          ocupadas: 0,
          disponibles: 0,
        });
      }
      const stats = ubicacionMap.get(mesa.ubicacion);
      stats.total += 1;
      if (mesa.estado === "ocupada") stats.ocupadas += 1;
      if (mesa.estado === "disponible") stats.disponibles += 1;
    });

    const mesasPorUbicacion = Array.from(ubicacionMap.values()).map((u) => ({
      ...u,
      porcentajeOcupacion:
        u.total > 0 ? ((u.ocupadas / u.total) * 100).toFixed(1) : 0,
    }));

    // Mesas más productivas (por ingresos)
    const mesaIngresosMap = new Map();
    pedidos
      .filter((p) => p.estado === "entregado")
      .forEach((pedido) => {
        const mesaId = pedido.mesaId?._id?.toString();
        if (!mesaId) return;

        if (!mesaIngresosMap.has(mesaId)) {
          mesaIngresosMap.set(mesaId, {
            mesaId,
            numero: pedido.mesaId?.numero || "N/A",
            ubicacion: pedido.mesaId?.ubicacion || "N/A",
            ingresos: 0,
            pedidos: 0,
          });
        }

        const stats = mesaIngresosMap.get(mesaId);
        stats.ingresos += pedido.total;
        stats.pedidos += 1;
      });

    const mesasMasProductivas = Array.from(mesaIngresosMap.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 10)
      .map((m) => ({
        ...m,
        ingresos: m.ingresos.toFixed(2),
        ticketPromedio: (m.ingresos / m.pedidos).toFixed(2),
      }));

    // Tasa de rotación (pedidos completados / mesas totales)
    const pedidosCompletados = pedidos.filter(
      (p) => p.estado === "entregado"
    ).length;
    const tasaRotacion =
      estadoMesas.total > 0
        ? (pedidosCompletados / estadoMesas.total).toFixed(2)
        : 0;

    res.json({
      success: true,
      data: {
        estadoMesas,
        mesasPorUbicacion,
        mesasMasProductivas,
        tasaRotacion: parseFloat(tasaRotacion),
        fecha: fechaConsulta,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasMesas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de mesas",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de empleados (meseros)
 * @route   GET /api/estadisticas/empleados
 * @access  Private (Admin)
 */
export const getEstadisticasEmpleados = async (req, res) => {
  try {
    const { periodo = "mes" } = req.query;
    const restauranteId = req.user.restauranteId;

    const { fechaInicio, fechaFin } = calcularRangoFechas(periodo);

    // Obtener pedidos del período con información del mesero
    const pedidos = await Pedido.find({
      restauranteId,
      createdAt: { $gte: fechaInicio, $lte: fechaFin },
      activo: true,
    }).populate("meseroId", "nombre apellido email");

    // Calcular estadísticas por mesero
    const meseroMap = new Map();

    pedidos.forEach((pedido) => {
      const meseroId = pedido.meseroId?._id?.toString();
      if (!meseroId) return;

      if (!meseroMap.has(meseroId)) {
        meseroMap.set(meseroId, {
          meseroId,
          nombre: `${pedido.meseroId.nombre} ${pedido.meseroId.apellido}`,
          email: pedido.meseroId.email,
          pedidosTotales: 0,
          pedidosCompletados: 0,
          pedidosCancelados: 0,
          ventasTotal: 0,
          propinasTotal: 0,
        });
      }

      const stats = meseroMap.get(meseroId);
      stats.pedidosTotales += 1;

      if (pedido.estado === "entregado") {
        stats.pedidosCompletados += 1;
        stats.ventasTotal += pedido.total;
        stats.propinasTotal += pedido.propina || 0;
      }

      if (pedido.estado === "cancelado") {
        stats.pedidosCancelados += 1;
      }
    });

    // Convertir a array y calcular métricas adicionales
    const performanceMeseros = Array.from(meseroMap.values())
      .map((mesero) => ({
        ...mesero,
        ticketPromedio:
          mesero.pedidosCompletados > 0
            ? (mesero.ventasTotal / mesero.pedidosCompletados).toFixed(2)
            : "0.00",
        tasaCompletados:
          mesero.pedidosTotales > 0
            ? (
                (mesero.pedidosCompletados / mesero.pedidosTotales) *
                100
              ).toFixed(1)
            : "0.0",
        propinaPromedio:
          mesero.pedidosCompletados > 0
            ? (mesero.propinasTotal / mesero.pedidosCompletados).toFixed(2)
            : "0.00",
        ventasTotal: mesero.ventasTotal.toFixed(2),
        propinasTotal: mesero.propinasTotal.toFixed(2),
      }))
      .sort((a, b) => parseFloat(b.ventasTotal) - parseFloat(a.ventasTotal));

    // Top 5 meseros por ventas
    const topMeseros = performanceMeseros.slice(0, 5);

    // Estadísticas generales del equipo
    const statsEquipo = {
      totalMeseros: meseroMap.size,
      pedidosTotales: pedidos.length,
      pedidosCompletados: pedidos.filter((p) => p.estado === "entregado")
        .length,
      ventasTotal: pedidos
        .filter((p) => p.estado === "entregado")
        .reduce((sum, p) => sum + p.total, 0)
        .toFixed(2),
      propinasTotal: pedidos
        .filter((p) => p.estado === "entregado")
        .reduce((sum, p) => sum + (p.propina || 0), 0)
        .toFixed(2),
    };

    res.json({
      success: true,
      data: {
        performanceMeseros,
        topMeseros,
        statsEquipo,
        periodo,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasEmpleados:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de empleados",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de inventario
 * @route   GET /api/estadisticas/inventario
 * @access  Private (Admin)
 */
export const getEstadisticasInventario = async (req, res) => {
  try {
    const restauranteId = req.user.restauranteId;

    // Obtener todos los items del inventario
    const inventario = await Inventario.find({ restauranteId, activo: true });

    // Calcular estadísticas
    const stats = {
      totalItems: inventario.length,
      stockBajo: inventario.filter(
        (item) => item.cantidad <= item.cantidadMinima
      ).length,
      sinStock: inventario.filter((item) => item.cantidad === 0).length,
      stockOptimo: inventario.filter(
        (item) => item.cantidad > item.cantidadMinima
      ).length,
    };

    // Productos con stock bajo (alertas)
    const alertasStock = inventario
      .filter((item) => item.cantidad <= item.cantidadMinima)
      .map((item) => ({
        id: item._id,
        nombre: item.nombre,
        categoria: item.categoria,
        cantidad: item.cantidad,
        unidad: item.unidad,
        cantidadMinima: item.cantidadMinima,
        nivelAlerta: item.cantidad === 0 ? "crítico" : "bajo",
      }))
      .sort((a, b) => a.cantidad - b.cantidad);

    // Distribución por categoría
    const categoriaMap = new Map();
    inventario.forEach((item) => {
      if (!categoriaMap.has(item.categoria)) {
        categoriaMap.set(item.categoria, {
          categoria: item.categoria,
          total: 0,
          stockBajo: 0,
          sinStock: 0,
        });
      }
      const stats = categoriaMap.get(item.categoria);
      stats.total += 1;
      if (item.cantidad <= item.cantidadMinima) stats.stockBajo += 1;
      if (item.cantidad === 0) stats.sinStock += 1;
    });

    const inventarioPorCategoria = Array.from(categoriaMap.values());

    // Valor total del inventario (si hay precio)
    const valorTotal = inventario
      .reduce((sum, item) => {
        const precio = item.precio || item.precioUnitario || 0;
        return sum + precio * item.cantidad;
      }, 0)
      .toFixed(2);

    res.json({
      success: true,
      data: {
        stats,
        alertasStock,
        inventarioPorCategoria,
        valorTotal: parseFloat(valorTotal),
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasInventario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de inventario",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener estadísticas de reservas
 * @route   GET /api/estadisticas/reservas
 * @access  Private (Admin)
 */
export const getEstadisticasReservas = async (req, res) => {
  try {
    const { periodo = "mes" } = req.query;
    const restauranteId = req.user.restauranteId;

    const { fechaInicio, fechaFin } = calcularRangoFechas(periodo);

    // Obtener reservas del período
    const reservas = await Reserva.find({
      restauranteId,
      fecha: { $gte: fechaInicio, $lte: fechaFin },
    });

    // Estadísticas generales
    const stats = {
      totalReservas: reservas.length,
      pendientes: reservas.filter((r) => r.estado === "pendiente").length,
      confirmadas: reservas.filter((r) => r.estado === "confirmada").length,
      completadas: reservas.filter((r) => r.estado === "completada").length,
      canceladas: reservas.filter((r) => r.estado === "cancelada").length,
      noShow: reservas.filter((r) => r.estado === "no_show").length,
      personasTotales: reservas.reduce((sum, r) => sum + r.numeroPersonas, 0),
    };

    // Tasa de conversión
    const reservasAtendidas = stats.completadas;
    stats.tasaConversion =
      stats.totalReservas > 0
        ? ((reservasAtendidas / stats.totalReservas) * 100).toFixed(1)
        : "0.0";
    stats.tasaNoShow =
      stats.totalReservas > 0
        ? ((stats.noShow / stats.totalReservas) * 100).toFixed(1)
        : "0.0";

    // Reservas por ocasión (si existe el campo)
    const ocasionMap = new Map();
    reservas.forEach((reserva) => {
      const ocasion = reserva.ocasion || "General";
      ocasionMap.set(ocasion, (ocasionMap.get(ocasion) || 0) + 1);
    });

    const reservasPorOcasion = Array.from(ocasionMap.entries())
      .map(([ocasion, cantidad]) => ({ ocasion, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    // Reservas por día de la semana
    const diaSemanaMap = new Map([
      [0, { dia: "Domingo", cantidad: 0 }],
      [1, { dia: "Lunes", cantidad: 0 }],
      [2, { dia: "Martes", cantidad: 0 }],
      [3, { dia: "Miércoles", cantidad: 0 }],
      [4, { dia: "Jueves", cantidad: 0 }],
      [5, { dia: "Viernes", cantidad: 0 }],
      [6, { dia: "Sábado", cantidad: 0 }],
    ]);

    reservas.forEach((reserva) => {
      const dia = new Date(reserva.fecha).getDay();
      const stats = diaSemanaMap.get(dia);
      if (stats) stats.cantidad += 1;
    });

    const reservasPorDia = Array.from(diaSemanaMap.values());

    // Promedio de personas por reserva
    const promedioPersonas =
      stats.totalReservas > 0
        ? (stats.personasTotales / stats.totalReservas).toFixed(1)
        : "0.0";

    res.json({
      success: true,
      data: {
        stats: {
          ...stats,
          promedioPersonas: parseFloat(promedioPersonas),
        },
        reservasPorOcasion,
        reservasPorDia,
        periodo,
      },
    });
  } catch (error) {
    console.error("Error en getEstadisticasReservas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de reservas",
      error: error.message,
    });
  }
};

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Calcular rango de fechas según el período
 */
function calcularRangoFechas(periodo) {
  const ahora = new Date();
  let fechaInicio, fechaFin;

  switch (periodo) {
    case "hoy":
      fechaInicio = new Date(ahora.setHours(0, 0, 0, 0));
      fechaFin = new Date(ahora.setHours(23, 59, 59, 999));
      break;

    case "ayer":
      const ayer = new Date(ahora);
      ayer.setDate(ayer.getDate() - 1);
      fechaInicio = new Date(ayer.setHours(0, 0, 0, 0));
      fechaFin = new Date(ayer.setHours(23, 59, 59, 999));
      break;

    case "semana":
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 7);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
      break;

    case "mes":
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 30);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
      break;

    case "trimestre":
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 90);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
      break;

    case "año":
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 365);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
      break;

    default:
      // Por defecto, último mes
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 30);
      fechaInicio.setHours(0, 0, 0, 0);
      fechaFin = new Date();
      fechaFin.setHours(23, 59, 59, 999);
  }

  return { fechaInicio, fechaFin };
}

/**
 * Calcular período anterior para comparaciones
 */
function calcularPeriodoAnterior(periodo) {
  const { fechaInicio, fechaFin } = calcularRangoFechas(periodo);
  const diferenciaDias = Math.ceil(
    (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)
  );

  const fechaInicioAnterior = new Date(fechaInicio);
  fechaInicioAnterior.setDate(fechaInicio.getDate() - diferenciaDias);

  const fechaFinAnterior = new Date(fechaInicio);
  fechaFinAnterior.setDate(fechaInicio.getDate() - 1);
  fechaFinAnterior.setHours(23, 59, 59, 999);

  return {
    fechaInicio: fechaInicioAnterior,
    fechaFin: fechaFinAnterior,
  };
}

/**
 * Agrupar ventas por día
 */
function agruparVentasPorDia(pedidos) {
  const ventasPorDia = new Map();

  pedidos.forEach((pedido) => {
    const fecha = new Date(pedido.createdAt);
    const key = fecha.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!ventasPorDia.has(key)) {
      ventasPorDia.set(key, {
        fecha: key,
        ventas: 0,
        pedidos: 0,
        propinas: 0,
      });
    }

    const stats = ventasPorDia.get(key);
    stats.ventas += pedido.total;
    stats.pedidos += 1;
    stats.propinas += pedido.propina || 0;
  });

  return Array.from(ventasPorDia.values())
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .map((d) => ({
      ...d,
      ventas: parseFloat(d.ventas.toFixed(2)),
      propinas: parseFloat(d.propinas.toFixed(2)),
    }));
}

/**
 * Agrupar ventas por hora
 */
function agruparVentasPorHora(pedidos) {
  const ventasPorHora = new Map();

  // Inicializar todas las horas (0-23)
  for (let i = 0; i < 24; i++) {
    ventasPorHora.set(i, {
      hora: `${i.toString().padStart(2, "0")}:00`,
      ventas: 0,
      pedidos: 0,
    });
  }

  pedidos.forEach((pedido) => {
    const hora = new Date(pedido.createdAt).getHours();
    const stats = ventasPorHora.get(hora);
    if (stats) {
      stats.ventas += pedido.total;
      stats.pedidos += 1;
    }
  });

  return Array.from(ventasPorHora.values()).map((h) => ({
    ...h,
    ventas: parseFloat(h.ventas.toFixed(2)),
  }));
}
