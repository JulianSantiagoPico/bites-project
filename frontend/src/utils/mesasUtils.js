/**
 * Utilidades para el módulo de Mesas
 */

// Obtener color según el estado de la mesa
export const getEstadoColor = (estado) => {
  const colores = {
    disponible: {
      color: "#10B981", // green-500
      bgColor: "#D1FAE5", // green-100
    },
    ocupada: {
      color: "#EF4444", // red-500
      bgColor: "#FEE2E2", // red-100
    },
    reservada: {
      color: "#3B82F6", // blue-500
      bgColor: "#DBEAFE", // blue-100
    },
    en_limpieza: {
      color: "#F59E0B", // yellow-500
      bgColor: "#FEF3C7", // yellow-100
    },
  };

  return colores[estado] || colores.disponible;
};

// Obtener icono según la ubicación
export const getUbicacionIcon = (ubicacion) => {
  const iconos = {
    Interior: "🏠",
    Terraza: "🌳",
    Bar: "🍷",
    VIP: "⭐",
  };

  return iconos[ubicacion] || "📍";
};

// Formatear estado para display
export const formatEstado = (estado) => {
  const estados = {
    disponible: "Disponible",
    ocupada: "Ocupada",
    reservada: "Reservada",
    en_limpieza: "En Limpieza",
  };

  return estados[estado] || estado;
};

// Validar si una transición de estado es permitida
export const canTransitionTo = (estadoActual, estadoNuevo) => {
  const transicionesPermitidas = {
    disponible: ["ocupada", "reservada", "en_limpieza"],
    ocupada: ["en_limpieza"],
    reservada: ["disponible", "ocupada"],
    en_limpieza: ["disponible"],
  };

  return transicionesPermitidas[estadoActual]?.includes(estadoNuevo) || false;
};

// Obtener opciones de estado según el estado actual
export const getEstadosDisponibles = (estadoActual) => {
  const transicionesPermitidas = {
    disponible: [
      { value: "ocupada", label: "Ocupada" },
      { value: "reservada", label: "Reservada" },
      { value: "en_limpieza", label: "En Limpieza" },
    ],
    ocupada: [{ value: "en_limpieza", label: "En Limpieza" }],
    reservada: [
      { value: "disponible", label: "Disponible" },
      { value: "ocupada", label: "Ocupada" },
    ],
    en_limpieza: [{ value: "disponible", label: "Disponible" }],
  };

  return transicionesPermitidas[estadoActual] || [];
};

// Calcular porcentaje de ocupación
export const calcularOcupacion = (mesas) => {
  if (!mesas || mesas.length === 0) return 0;

  const ocupadas = mesas.filter((m) => m.estado === "ocupada").length;
  return ((ocupadas / mesas.length) * 100).toFixed(1);
};

// Obtener color del icono de estado
export const getEstadoIconColor = (estado) => {
  const colores = {
    disponible: "text-green-500",
    ocupada: "text-red-500",
    reservada: "text-blue-500",
    en_limpieza: "text-yellow-500",
  };

  return colores[estado] || "text-gray-500";
};

// Filtrar mesas según criterios
export const filtrarMesas = (
  mesas,
  searchTerm,
  filterUbicacion,
  filterEstado
) => {
  return mesas.filter((mesa) => {
    // Solo mostrar mesas activas (no eliminadas)
    if (!mesa.activo) return false;

    // Filtro de búsqueda por número
    const matchSearch = searchTerm
      ? mesa.numero.toString().includes(searchTerm)
      : true;

    // Filtro por ubicación
    const matchUbicacion =
      !filterUbicacion || filterUbicacion === "Todas"
        ? true
        : mesa.ubicacion === filterUbicacion;

    // Filtro por estado
    const matchEstado =
      !filterEstado || filterEstado === "Todos"
        ? true
        : mesa.estado === filterEstado;

    return matchSearch && matchUbicacion && matchEstado;
  });
};

// Agrupar mesas por ubicación
export const agruparPorUbicacion = (mesas) => {
  const agrupadas = {
    Interior: [],
    Terraza: [],
    Bar: [],
    VIP: [],
  };

  mesas.forEach((mesa) => {
    if (agrupadas[mesa.ubicacion]) {
      agrupadas[mesa.ubicacion].push(mesa);
    }
  });

  return agrupadas;
};

// Obtener estadísticas rápidas
export const getEstadisticasRapidas = (mesas) => {
  const activas = mesas.filter((m) => m.activo);

  return {
    total: activas.length,
    disponibles: activas.filter((m) => m.estado === "disponible").length,
    ocupadas: activas.filter((m) => m.estado === "ocupada").length,
    reservadas: activas.filter((m) => m.estado === "reservada").length,
    enLimpieza: activas.filter((m) => m.estado === "en_limpieza").length,
    capacidadTotal: activas.reduce((sum, m) => sum + m.capacidad, 0),
    porUbicacion: {
      Interior: activas.filter((m) => m.ubicacion === "Interior").length,
      Terraza: activas.filter((m) => m.ubicacion === "Terraza").length,
      Bar: activas.filter((m) => m.ubicacion === "Bar").length,
      VIP: activas.filter((m) => m.ubicacion === "VIP").length,
    },
  };
};

// Validar datos de mesa
export const validarMesa = (mesaData) => {
  const errores = {};

  if (!mesaData.numero || mesaData.numero < 1) {
    errores.numero = "El número de mesa debe ser mayor a 0";
  }

  if (
    !mesaData.capacidad ||
    mesaData.capacidad < 1 ||
    mesaData.capacidad > 20
  ) {
    errores.capacidad = "La capacidad debe estar entre 1 y 20 personas";
  }

  if (!mesaData.ubicacion) {
    errores.ubicacion = "La ubicación es requerida";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};

// Obtener nombre completo del mesero
export const getMeseroNombre = (meseroAsignado) => {
  if (!meseroAsignado) return "Sin asignar";
  return `${meseroAsignado.nombre} ${meseroAsignado.apellido}`;
};

// Formatear capacidad
export const formatCapacidad = (capacidad) => {
  return `${capacidad} ${capacidad === 1 ? "persona" : "personas"}`;
};
