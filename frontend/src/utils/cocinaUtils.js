/**
 * Utilidades para el módulo de cocina
 */

/**
 * Obtener color según prioridad de la orden
 */
export const getPrioridadColor = (prioridad) => {
  switch (prioridad) {
    case "alta":
      return {
        bg: "#a4161a20",
        border: "#a4161a",
        text: "#a4161a",
        label: "Urgente",
      };
    case "media":
      return {
        bg: "#ffd16620",
        border: "#ffd166",
        text: "#c89d00",
        label: "Media",
      };
    default:
      return {
        bg: "#6bbf5920",
        border: "#6bbf59",
        text: "#6bbf59",
        label: "Normal",
      };
  }
};

/**
 * Obtener badge de estado
 */
export const getEstadoBadge = (estado) => {
  const badges = {
    pendiente: {
      label: "Pendiente",
      color: "#e6af2e",
      bg: "#e6af2e20",
      icon: "⏳",
    },
    en_preparacion: {
      label: "En Preparación",
      color: "#581845",
      bg: "#58184520",
      icon: "👨‍🍳",
    },
    listo: {
      label: "Listo",
      color: "#6bbf59",
      bg: "#6bbf5920",
      icon: "✅",
    },
  };

  return badges[estado] || badges.pendiente;
};

/**
 * Calcular tiempo de espera desde creación
 */
export const calcularTiempoEspera = (fechaCreacion) => {
  const ahora = new Date();
  const creacion = new Date(fechaCreacion);
  const diferencia = Math.floor((ahora - creacion) / 60000); // En minutos
  return diferencia;
};

/**
 * Formatear tiempo de espera
 */
export const formatearTiempoEspera = (minutos) => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
};

/**
 * Determinar prioridad según tiempo de espera
 */
export const determinarPrioridad = (tiempoEspera) => {
  if (tiempoEspera > 30) return "alta";
  if (tiempoEspera > 15) return "media";
  return "normal";
};

/**
 * Formatear fecha y hora
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatear solo hora
 */
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formatear precio
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Agrupar órdenes por prioridad
 */
export const agruparPorPrioridad = (ordenes) => {
  const altas = [];
  const medias = [];
  const normales = [];

  ordenes.forEach((orden) => {
    switch (orden.prioridad) {
      case "alta":
        altas.push(orden);
        break;
      case "media":
        medias.push(orden);
        break;
      default:
        normales.push(orden);
    }
  });

  return {
    altas,
    medias,
    normales,
    todas: [...altas, ...medias, ...normales],
  };
};

/**
 * Obtener mensaje de notificación según tipo
 */
export const getMensajeNotificacion = (tipo, orden) => {
  const mensajes = {
    nuevo: `🔔 Nuevo pedido: ${orden.numeroPedido}`,
    comenzado: `👨‍🍳 Preparación iniciada: ${orden.numeroPedido}`,
    listo: `✅ Pedido listo: ${orden.numeroPedido}`,
    cancelado: `❌ Pedido cancelado: ${orden.numeroPedido}`,
  };

  return mensajes[tipo] || `Actualización: ${orden.numeroPedido}`;
};
