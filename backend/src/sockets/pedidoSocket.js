/**
 * Socket.IO - Eventos de pedidos en tiempo real
 * Gestiona las notificaciones y actualizaciones de pedidos
 */

/**
 * Emitir evento de nuevo pedido creado
 * @param {Object} io - Instancia de Socket.IO
 * @param {String} restauranteId - ID del restaurante
 * @param {Object} pedido - Datos del pedido
 */
export const emitNuevoPedido = (io, restauranteId, pedido) => {
  console.log(`📨 [Socket] Nuevo pedido: ${pedido.numeroPedido}`);

  // Emitir a todos los usuarios del restaurante
  io.to(`restaurante:${restauranteId}`).emit("pedido:nuevo", {
    pedido,
    timestamp: new Date(),
  });

  // Emitir específicamente a la cocina
  io.to(`cocina:${restauranteId}`).emit("cocina:nuevoPedido", {
    pedido,
    timestamp: new Date(),
  });
};

/**
 * Emitir evento de cambio de estado de pedido
 * @param {Object} io - Instancia de Socket.IO
 * @param {String} restauranteId - ID del restaurante
 * @param {Object} pedido - Datos del pedido actualizado
 * @param {String} estadoAnterior - Estado anterior del pedido
 */
export const emitCambioEstado = (io, restauranteId, pedido, estadoAnterior) => {
  console.log(
    `🔄 [Socket] Cambio de estado: ${pedido.numeroPedido} (${estadoAnterior} → ${pedido.estado})`
  );

  // Emitir a todos los usuarios del restaurante
  io.to(`restaurante:${restauranteId}`).emit("pedido:cambioEstado", {
    pedido,
    estadoAnterior,
    estadoNuevo: pedido.estado,
    timestamp: new Date(),
  });

  // Si el pedido está listo, notificar específicamente
  if (pedido.estado === "listo") {
    io.to(`restaurante:${restauranteId}`).emit("pedido:listo", {
      pedido,
      timestamp: new Date(),
    });
  }

  // Si el pedido comienza preparación, notificar a cocina
  if (pedido.estado === "en_preparacion") {
    io.to(`cocina:${restauranteId}`).emit("cocina:pedidoEnPreparacion", {
      pedido,
      timestamp: new Date(),
    });
  }
};

/**
 * Emitir evento de pedido actualizado
 * @param {Object} io - Instancia de Socket.IO
 * @param {String} restauranteId - ID del restaurante
 * @param {Object} pedido - Datos del pedido actualizado
 */
export const emitPedidoActualizado = (io, restauranteId, pedido) => {
  console.log(`✏️ [Socket] Pedido actualizado: ${pedido.numeroPedido}`);

  io.to(`restaurante:${restauranteId}`).emit("pedido:actualizado", {
    pedido,
    timestamp: new Date(),
  });

  // Notificar a cocina si está en preparación o pendiente
  if (["pendiente", "en_preparacion"].includes(pedido.estado)) {
    io.to(`cocina:${restauranteId}`).emit("cocina:pedidoActualizado", {
      pedido,
      timestamp: new Date(),
    });
  }
};

/**
 * Emitir evento de pedido cancelado
 * @param {Object} io - Instancia de Socket.IO
 * @param {String} restauranteId - ID del restaurante
 * @param {Object} pedido - Datos del pedido cancelado
 */
export const emitPedidoCancelado = (io, restauranteId, pedido) => {
  console.log(`❌ [Socket] Pedido cancelado: ${pedido.numeroPedido}`);

  io.to(`restaurante:${restauranteId}`).emit("pedido:cancelado", {
    pedido,
    timestamp: new Date(),
  });

  io.to(`cocina:${restauranteId}`).emit("cocina:pedidoCancelado", {
    pedido,
    timestamp: new Date(),
  });
};

/**
 * Emitir actualización de estadísticas
 * @param {Object} io - Instancia de Socket.IO
 * @param {String} restauranteId - ID del restaurante
 * @param {Object} estadisticas - Estadísticas actualizadas
 */
export const emitEstadisticasActualizadas = (
  io,
  restauranteId,
  estadisticas
) => {
  io.to(`restaurante:${restauranteId}`).emit("estadisticas:actualizadas", {
    estadisticas,
    timestamp: new Date(),
  });
};
