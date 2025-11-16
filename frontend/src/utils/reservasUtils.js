// Utilidades para el módulo de Reservas

/**
 * Estados posibles de una reserva
 */
export const ESTADOS_RESERVA = {
  PENDIENTE: "pendiente",
  CONFIRMADA: "confirmada",
  SENTADA: "sentada",
  COMPLETADA: "completada",
  CANCELADA: "cancelada",
  NO_SHOW: "no_show",
};

/**
 * Ocasiones especiales para reservas
 */
export const OCASIONES = {
  NINGUNA: "ninguna",
  CUMPLEAÑOS: "cumpleaños",
  ANIVERSARIO: "aniversario",
  CITA: "cita",
  NEGOCIO: "negocio",
  OTRO: "otro",
};

/**
 * Obtiene el color asociado a un estado de reserva
 * @param {string} estado - Estado de la reserva
 * @returns {string} Color en formato hexadecimal
 */
export const getEstadoColor = (estado) => {
  const colores = {
    pendiente: "#f59e0b", // Amber
    confirmada: "#10b981", // Green
    sentada: "#3b82f6", // Blue
    completada: "#6b7280", // Gray
    cancelada: "#ef4444", // Red
    no_show: "#8b5cf6", // Purple
  };
  return colores[estado] || "#6b7280";
};

/**
 * Obtiene la etiqueta traducida de un estado
 * @param {string} estado - Estado de la reserva
 * @returns {string} Etiqueta en español
 */
export const getEstadoLabel = (estado) => {
  const labels = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    sentada: "Sentada",
    completada: "Completada",
    cancelada: "Cancelada",
    no_show: "No Show",
  };
  return labels[estado] || estado;
};

/**
 * Obtiene la etiqueta traducida de una ocasión
 * @param {string} ocasion - Ocasión de la reserva
 * @returns {string} Etiqueta en español
 */
export const getOcasionLabel = (ocasion) => {
  // Intentar obtener de localStorage primero (ocasiones personalizadas)
  try {
    const customOcasiones = localStorage.getItem("customOcasiones");
    if (customOcasiones) {
      const parsed = JSON.parse(customOcasiones);
      if (parsed.ocasionesDisplay && parsed.ocasionesDisplay[ocasion]) {
        return parsed.ocasionesDisplay[ocasion];
      }
    }
  } catch (error) {
    console.error("Error al leer ocasiones personalizadas:", error);
  }

  // Fallback a labels predeterminadas
  const labels = {
    ninguna: "Sin ocasión",
    cumpleaños: "Cumpleaños",
    aniversario: "Aniversario",
    cita: "Cita",
    negocio: "Negocio",
    otro: "Otro",
  };
  return labels[ocasion] || ocasion;
};

/**
 * Formatea una fecha a formato legible en español
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada (ej: "Lunes, 20 de Noviembre 2025")
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-ES", opciones);
};

/**
 * Formatea una fecha a formato corto (DD/MM/YYYY)
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaCorta = (fecha) => {
  if (!fecha) return "";
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const año = date.getFullYear();
  return `${dia}/${mes}/${año}`;
};

/**
 * Formatea una hora (HH:MM) a formato de 12 horas con AM/PM
 * @param {string} hora - Hora en formato HH:MM
 * @returns {string} Hora formateada (ej: "7:00 PM")
 */
export const formatearHora = (hora) => {
  if (!hora) return "";
  const [horas, minutos] = hora.split(":");
  const horaNum = parseInt(horas);
  const periodo = horaNum >= 12 ? "PM" : "AM";
  const hora12 = horaNum === 0 ? 12 : horaNum > 12 ? horaNum - 12 : horaNum;
  return `${hora12}:${minutos} ${periodo}`;
};

/**
 * Obtiene el icono apropiado para una ocasión
 * @param {string} ocasion - Ocasión de la reserva
 * @returns {string} Emoji del icono
 */
export const getOcasionIcon = (ocasion) => {
  // Intentar obtener de localStorage primero (ocasiones personalizadas)
  try {
    const customOcasiones = localStorage.getItem("customOcasiones");
    if (customOcasiones) {
      const parsed = JSON.parse(customOcasiones);
      if (parsed.ocasionesIcons && parsed.ocasionesIcons[ocasion]) {
        return parsed.ocasionesIcons[ocasion];
      }
    }
  } catch (error) {
    console.error("Error al leer iconos de ocasiones:", error);
  }

  // Fallback a iconos predeterminados
  const iconos = {
    ninguna: "📅",
    cumpleaños: "🎂",
    aniversario: "💐",
    cita: "💑",
    negocio: "💼",
    otro: "🎉",
  };
  return iconos[ocasion] || "📅";
};

/**
 * Valida si una reserva está en un estado que permite edición
 * @param {string} estado - Estado de la reserva
 * @returns {boolean} True si se puede editar
 */
export const puedeEditarReserva = (estado) => {
  return (
    estado === ESTADOS_RESERVA.PENDIENTE ||
    estado === ESTADOS_RESERVA.CONFIRMADA
  );
};

/**
 * Obtiene todas las ocasiones disponibles (predeterminadas + personalizadas)
 * @returns {Object} Objeto con todas las ocasiones
 */
export const getCurrentOcasiones = () => {
  // Ocasiones predeterminadas
  const defaultOcasiones = {
    ninguna: "Sin ocasión",
    cumpleaños: "Cumpleaños",
    aniversario: "Aniversario",
    cita: "Cita",
    negocio: "Negocio",
    otro: "Otro",
  };

  // Intentar obtener ocasiones personalizadas
  try {
    const customOcasiones = localStorage.getItem("customOcasiones");
    if (customOcasiones) {
      const parsed = JSON.parse(customOcasiones);
      if (parsed.ocasionesDisplay) {
        return {
          ...defaultOcasiones,
          ...parsed.ocasionesDisplay,
        };
      }
    }
  } catch (error) {
    console.error("Error al leer ocasiones personalizadas:", error);
  }

  return defaultOcasiones;
};

/**
 * Valida si una reserva está en un estado que permite cambio de estado
 * @param {string} estadoActual - Estado actual de la reserva
 * @param {string} nuevoEstado - Nuevo estado propuesto
 * @returns {boolean} True si la transición es válida
 */
export const esTransicionValida = (estadoActual, nuevoEstado) => {
  const transicionesValidas = {
    pendiente: ["confirmada", "cancelada"],
    confirmada: ["sentada", "cancelada", "no_show"],
    sentada: ["completada"],
    completada: [],
    cancelada: [],
    no_show: [],
  };

  return transicionesValidas[estadoActual]?.includes(nuevoEstado) || false;
};

/**
 * Obtiene los estados disponibles para cambiar desde el estado actual
 * @param {string} estadoActual - Estado actual de la reserva
 * @returns {Array} Array de objetos con value y label
 */
export const getEstadosDisponibles = (estadoActual) => {
  const transicionesValidas = {
    pendiente: [
      { value: "confirmada", label: "Confirmar" },
      { value: "cancelada", label: "Cancelar" },
    ],
    confirmada: [
      { value: "sentada", label: "Sentar Clientes" },
      { value: "no_show", label: "Marcar No Show" },
      { value: "cancelada", label: "Cancelar" },
    ],
    sentada: [{ value: "completada", label: "Completar" }],
    completada: [],
    cancelada: [],
    no_show: [],
  };

  return transicionesValidas[estadoActual] || [];
};

/**
 * Determina si una reserva es del día actual
 * @param {string|Date} fecha - Fecha de la reserva
 * @returns {boolean} True si es hoy
 */
export const esHoy = (fecha) => {
  if (!fecha) return false;
  const hoy = new Date();
  const fechaReserva = new Date(fecha);
  return (
    fechaReserva.getDate() === hoy.getDate() &&
    fechaReserva.getMonth() === hoy.getMonth() &&
    fechaReserva.getFullYear() === hoy.getFullYear()
  );
};

/**
 * Determina si una reserva es del día siguiente
 * @param {string|Date} fecha - Fecha de la reserva
 * @returns {boolean} True si es mañana
 */
export const esMañana = (fecha) => {
  if (!fecha) return false;
  const mañana = new Date();
  mañana.setDate(mañana.getDate() + 1);
  const fechaReserva = new Date(fecha);
  return (
    fechaReserva.getDate() === mañana.getDate() &&
    fechaReserva.getMonth() === mañana.getMonth() &&
    fechaReserva.getFullYear() === mañana.getFullYear()
  );
};

/**
 * Determina si una fecha/hora ya pasó
 * @param {string|Date} fecha - Fecha de la reserva
 * @param {string} hora - Hora de la reserva (HH:MM)
 * @returns {boolean} True si ya pasó
 */
export const haPasado = (fecha, hora) => {
  if (!fecha || !hora) return false;
  const fechaReserva = new Date(fecha);
  const [horas, minutos] = hora.split(":");
  fechaReserva.setHours(parseInt(horas), parseInt(minutos), 0, 0);
  return fechaReserva < new Date();
};

/**
 * Filtra reservas según criterios
 * @param {Array} reservas - Array de reservas
 * @param {Object} filtros - Objeto con filtros (estado, fecha, busqueda)
 * @returns {Array} Reservas filtradas
 */
export const filtrarReservas = (reservas, filtros) => {
  if (!reservas || !Array.isArray(reservas)) return [];

  return reservas.filter((reserva) => {
    // Filtrar eliminadas (soft delete)
    if (!reserva.activo) return false;

    // Filtro por estado
    if (filtros.estado && filtros.estado !== "todos") {
      if (reserva.estado !== filtros.estado) return false;
    }

    // Filtro por fecha
    if (filtros.fecha) {
      const fechaReserva = new Date(reserva.fecha).toISOString().split("T")[0];
      const fechaFiltro = new Date(filtros.fecha).toISOString().split("T")[0];
      if (fechaReserva !== fechaFiltro) return false;
    }

    // Filtro por búsqueda (nombre, teléfono, email)
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      const nombre = reserva.nombreCliente?.toLowerCase() || "";
      const telefono = reserva.telefonoCliente?.toLowerCase() || "";
      const email = reserva.emailCliente?.toLowerCase() || "";

      if (
        !nombre.includes(busqueda) &&
        !telefono.includes(busqueda) &&
        !email.includes(busqueda)
      ) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Ordena reservas por fecha y hora
 * @param {Array} reservas - Array de reservas
 * @param {string} orden - 'asc' o 'desc'
 * @returns {Array} Reservas ordenadas
 */
export const ordenarReservasPorFecha = (reservas, orden = "asc") => {
  if (!reservas || !Array.isArray(reservas)) return [];

  return [...reservas].sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);

    // Si las fechas son iguales, ordenar por hora
    if (fechaA.getTime() === fechaB.getTime()) {
      const [horasA, minutosA] = (a.hora || "00:00").split(":");
      const [horasB, minutosB] = (b.hora || "00:00").split(":");
      const horaA = parseInt(horasA) * 60 + parseInt(minutosA);
      const horaB = parseInt(horasB) * 60 + parseInt(minutosB);
      return orden === "asc" ? horaA - horaB : horaB - horaA;
    }

    return orden === "asc"
      ? fechaA.getTime() - fechaB.getTime()
      : fechaB.getTime() - fechaA.getTime();
  });
};

/**
 * Valida el formato de teléfono
 * @param {string} telefono - Número de teléfono
 * @returns {boolean} True si es válido
 */
export const validarTelefono = (telefono) => {
  if (!telefono) return false;
  // Acepta formatos: 555-0101, +1-555-0101, (555) 0101, 5550101, etc.
  const regex =
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return regex.test(telefono);
};

/**
 * Valida el formato de email
 * @param {string} email - Dirección de email
 * @returns {boolean} True si es válido
 */
export const validarEmail = (email) => {
  if (!email) return true; // Email es opcional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida el formato de hora (HH:MM)
 * @param {string} hora - Hora en formato HH:MM
 * @returns {boolean} True si es válido
 */
export const validarHora = (hora) => {
  if (!hora) return false;
  const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(hora);
};

/**
 * Valida que una fecha no sea en el pasado
 * @param {string|Date} fecha - Fecha a validar
 * @returns {boolean} True si es válida (hoy o futura)
 */
export const validarFechaFutura = (fecha) => {
  if (!fecha) return false;
  const fechaReserva = new Date(fecha);
  fechaReserva.setHours(0, 0, 0, 0);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return fechaReserva >= hoy;
};

/**
 * Genera opciones de hora para un select (intervalo de 30 minutos)
 * @param {string} horaInicio - Hora de inicio (ej: "11:00")
 * @param {string} horaFin - Hora de fin (ej: "23:00")
 * @returns {Array} Array de objetos {value, label}
 */
export const generarOpcionesHora = (
  horaInicio = "11:00",
  horaFin = "23:00"
) => {
  const opciones = [];
  const [horaInicioNum, minInicioNum] = horaInicio.split(":").map(Number);
  const [horaFinNum, minFinNum] = horaFin.split(":").map(Number);

  let horaActual = horaInicioNum * 60 + minInicioNum;
  const horaFinTotal = horaFinNum * 60 + minFinNum;

  while (horaActual <= horaFinTotal) {
    const horas = Math.floor(horaActual / 60);
    const minutos = horaActual % 60;
    const horaStr = `${String(horas).padStart(2, "0")}:${String(
      minutos
    ).padStart(2, "0")}`;

    opciones.push({
      value: horaStr,
      label: formatearHora(horaStr),
    });

    horaActual += 30; // Incremento de 30 minutos
  }

  return opciones;
};

/**
 * Calcula estadísticas de un array de reservas
 * @param {Array} reservas - Array de reservas
 * @returns {Object} Objeto con estadísticas
 */
export const calcularEstadisticas = (reservas) => {
  if (!reservas || !Array.isArray(reservas)) {
    return {
      total: 0,
      pendientes: 0,
      confirmadas: 0,
      sentadas: 0,
      completadas: 0,
      canceladas: 0,
      noShow: 0,
      hoy: 0,
      mañana: 0,
      totalPersonas: 0,
    };
  }

  const activas = reservas.filter((r) => r.activo);

  return {
    total: activas.length,
    pendientes: activas.filter((r) => r.estado === ESTADOS_RESERVA.PENDIENTE)
      .length,
    confirmadas: activas.filter((r) => r.estado === ESTADOS_RESERVA.CONFIRMADA)
      .length,
    sentadas: activas.filter((r) => r.estado === ESTADOS_RESERVA.SENTADA)
      .length,
    completadas: activas.filter((r) => r.estado === ESTADOS_RESERVA.COMPLETADA)
      .length,
    canceladas: activas.filter((r) => r.estado === ESTADOS_RESERVA.CANCELADA)
      .length,
    noShow: activas.filter((r) => r.estado === ESTADOS_RESERVA.NO_SHOW).length,
    hoy: activas.filter((r) => esHoy(r.fecha)).length,
    mañana: activas.filter((r) => esMañana(r.fecha)).length,
    totalPersonas: activas.reduce((sum, r) => sum + (r.numeroPersonas || 0), 0),
  };
};
