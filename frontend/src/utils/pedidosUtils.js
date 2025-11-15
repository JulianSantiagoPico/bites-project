/**
 * Utilidades para el módulo de Pedidos
 * Helpers, formatters y funciones auxiliares
 */

// Formatear precio en dólares
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Formatear número de pedido
export const formatPedidoNumber = (numeroPedido) => {
  if (!numeroPedido) return "N/A";
  return numeroPedido;
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  const fecha = dateObj.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${fecha} ${hora}`;
};

// Formatear solo hora
export const formatTime = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formatear solo fecha
export const formatDate = (date) => {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Calcular subtotal de items
export const calculateSubtotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.subtotal, 0);
};

// Calcular total del pedido
export const calculateTotal = (subtotal, impuestos = 0, propina = 0) => {
  return subtotal + impuestos + propina;
};

// Obtener color y estilo según estado del pedido
export const getEstadoBadgeColor = (estado) => {
  const estados = {
    pendiente: {
      bg: "bg-warning/20",
      text: "text-warning",
      color: "#ffd166",
      bgColor: "#FEF3C7",
      label: "Pendiente",
      icon: "⏳",
    },
    en_preparacion: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      color: "#4A90E2",
      bgColor: "#DBEAFE",
      label: "En Preparación",
      icon: "👨‍🍳",
    },
    listo: {
      bg: "bg-success/20",
      text: "text-success",
      color: "#6bbf59",
      bgColor: "#D1FAE5",
      label: "Listo",
      icon: "✅",
    },
    entregado: {
      bg: "bg-gray-200",
      text: "text-gray-700",
      color: "#6b7280",
      bgColor: "#E5E7EB",
      label: "Entregado",
      icon: "📦",
    },
    cancelado: {
      bg: "bg-error/20",
      text: "text-error",
      color: "#a4161a",
      bgColor: "#FEE2E2",
      label: "Cancelado",
      icon: "❌",
    },
  };

  return estados[estado] || estados.pendiente;
};

// Obtener label del estado en español
export const getEstadoLabel = (estado) => {
  const labels = {
    pendiente: "Pendiente",
    en_preparacion: "En Preparación",
    listo: "Listo",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return labels[estado] || estado;
};

// Verificar si un pedido puede ser editado
export const canEditPedido = (estado) => {
  return estado === "pendiente";
};

// Verificar si un pedido puede cambiar de estado
export const canChangeEstado = (estadoActual, nuevoEstado) => {
  const transicionesValidas = {
    pendiente: ["en_preparacion", "cancelado"],
    en_preparacion: ["listo", "cancelado"],
    listo: ["entregado", "cancelado"],
    entregado: [],
    cancelado: [],
  };

  return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
};

// Obtener estados disponibles para transición
export const getAvailableEstados = (estadoActual) => {
  const transiciones = {
    pendiente: [
      { value: "en_preparacion", label: "En Preparación" },
      { value: "cancelado", label: "Cancelar" },
    ],
    en_preparacion: [
      { value: "listo", label: "Listo" },
      { value: "cancelado", label: "Cancelar" },
    ],
    listo: [
      { value: "entregado", label: "Entregado" },
      { value: "cancelado", label: "Cancelar" },
    ],
    entregado: [],
    cancelado: [],
  };

  return transiciones[estadoActual] || [];
};

// Obtener estados disponibles con información completa (color, icono, etc.)
export const getEstadosDisponibles = (estadoActual) => {
  const estadosInfo = {
    en_preparacion: {
      value: "en_preparacion",
      label: "En Preparación",
      icon: "👨‍🍳",
      color: "#4A90E2",
    },
    listo: {
      value: "listo",
      label: "Listo",
      icon: "✅",
      color: "#6bbf59",
    },
    entregado: {
      value: "entregado",
      label: "Entregado",
      icon: "📦",
      color: "#6b7280",
    },
    cancelado: {
      value: "cancelado",
      label: "Cancelado",
      icon: "❌",
      color: "#a4161a",
    },
  };

  const transiciones = {
    pendiente: ["en_preparacion", "cancelado"],
    en_preparacion: ["listo", "cancelado"],
    listo: ["entregado", "cancelado"],
    entregado: [],
    cancelado: [],
  };

  const estadosDisponibles = transiciones[estadoActual] || [];
  return estadosDisponibles
    .map((estado) => estadosInfo[estado])
    .filter(Boolean);
};

// Formatear items para mostrar
export const formatItems = (items) => {
  if (!items || items.length === 0) return "Sin items";
  return items.map((item) => `${item.cantidad}x ${item.nombre}`).join(", ");
};

// Calcular tiempo transcurrido desde creación
export const getTimeElapsed = (createdAt) => {
  if (!createdAt) return "N/A";

  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Recién creado";
  if (diffMins < 60) return `${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;

  if (diffHours < 24) {
    return remainingMins > 0
      ? `${diffHours}h ${remainingMins}min`
      : `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
};

// Obtener prioridad del pedido basado en tiempo y estado
export const getPedidoPriority = (pedido) => {
  const { estado, createdAt } = pedido;
  const timeElapsedMins = Math.floor(
    (new Date() - new Date(createdAt)) / 60000
  );

  // Pedidos listos tienen máxima prioridad
  if (estado === "listo") return { level: "high", label: "Alta" };

  // Pedidos en preparación por más de 30 minutos
  if (estado === "en_preparacion" && timeElapsedMins > 30) {
    return { level: "high", label: "Alta" };
  }

  // Pedidos pendientes por más de 15 minutos
  if (estado === "pendiente" && timeElapsedMins > 15) {
    return { level: "medium", label: "Media" };
  }

  return { level: "normal", label: "Normal" };
};

// Filtrar pedidos por búsqueda
export const filterPedidos = (pedidos, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return pedidos;

  const term = searchTerm.toLowerCase().trim();

  return pedidos.filter((pedido) => {
    // Buscar en número de pedido
    if (pedido.numeroPedido?.toLowerCase().includes(term)) return true;

    // Buscar en nombre del cliente
    if (pedido.nombreCliente?.toLowerCase().includes(term)) return true;

    // Buscar en número de mesa
    if (pedido.mesaId?.numero?.toString().includes(term)) return true;

    // Buscar en items
    if (
      pedido.items?.some((item) => item.nombre.toLowerCase().includes(term))
    ) {
      return true;
    }

    return false;
  });
};

// Ordenar pedidos por prioridad
export const sortByPriority = (pedidos) => {
  const priorityOrder = {
    listo: 1,
    en_preparacion: 2,
    pendiente: 3,
    entregado: 4,
    cancelado: 5,
  };

  return [...pedidos].sort((a, b) => {
    // Primero por estado
    const estadoDiff = priorityOrder[a.estado] - priorityOrder[b.estado];
    if (estadoDiff !== 0) return estadoDiff;

    // Luego por tiempo (más antiguos primero)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
};

// Agrupar pedidos por estado
export const groupByEstado = (pedidos) => {
  return pedidos.reduce((grupos, pedido) => {
    const estado = pedido.estado;
    if (!grupos[estado]) {
      grupos[estado] = [];
    }
    grupos[estado].push(pedido);
    return grupos;
  }, {});
};

// Validar si se puede crear un pedido
export const validatePedidoData = (data) => {
  const errors = [];

  if (!data.mesaId) {
    errors.push("Debe seleccionar una mesa");
  }

  if (!data.items || data.items.length === 0) {
    errors.push("Debe agregar al menos un producto");
  }

  if (data.items) {
    data.items.forEach((item, index) => {
      if (!item.productoId) {
        errors.push(`Item ${index + 1}: Producto no seleccionado`);
      }
      if (!item.cantidad || item.cantidad < 1) {
        errors.push(`Item ${index + 1}: Cantidad inválida`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Calcular estadísticas de un conjunto de pedidos
export const calculatePedidosStats = (pedidos) => {
  const stats = {
    total: pedidos.length,
    pendientes: 0,
    enPreparacion: 0,
    listos: 0,
    entregados: 0,
    cancelados: 0,
    ventasTotal: 0,
    propinaTotal: 0,
    ticketPromedio: 0,
  };

  pedidos.forEach((pedido) => {
    // Contar por estado
    switch (pedido.estado) {
      case "pendiente":
        stats.pendientes++;
        break;
      case "en_preparacion":
        stats.enPreparacion++;
        break;
      case "listo":
        stats.listos++;
        break;
      case "entregado":
        stats.entregados++;
        stats.ventasTotal += pedido.total || 0;
        stats.propinaTotal += pedido.propina || 0;
        break;
      case "cancelado":
        stats.cancelados++;
        break;
    }
  });

  // Calcular ticket promedio
  if (stats.entregados > 0) {
    stats.ticketPromedio = stats.ventasTotal / stats.entregados;
  }

  return stats;
};

// Exportar todas las utilidades
export default {
  formatPrice,
  formatPedidoNumber,
  formatDateTime,
  formatTime,
  formatDate,
  calculateSubtotal,
  calculateTotal,
  getEstadoBadgeColor,
  getEstadoLabel,
  canEditPedido,
  canChangeEstado,
  getAvailableEstados,
  getEstadosDisponibles,
  formatItems,
  getTimeElapsed,
  getPedidoPriority,
  filterPedidos,
  sortByPriority,
  groupByEstado,
  validatePedidoData,
  calculatePedidosStats,
};
