// Mapeo de categorías con su emoji
export const categoriasDisplay = {
  Carnes: "🥩 Carnes",
  Vegetales: "🥬 Vegetales",
  Lácteos: "🧀 Lácteos",
  Bebidas: "🥤 Bebidas",
  Especias: "🌶️ Especias",
  Otros: "📦 Otros",
};

// Mapeo de unidades de medida
export const unidadesMedida = {
  kg: "Kilogramos (kg)",
  litros: "Litros",
  unidades: "Unidades",
  cajas: "Cajas",
};

// Obtener el icono según la categoría
export const getCategoryIcon = (categoria) => {
  const icons = {
    Carnes: "🥩",
    Vegetales: "🥬",
    Lácteos: "🧀",
    Bebidas: "🥤",
    Especias: "🌶️",
    Otros: "📦",
  };
  return icons[categoria] || "📦";
};

// Obtener el color según el estado del stock
export const getStatusColor = (estado) => {
  const statusColors = {
    Normal: {
      bg: "bg-green-50",
      text: "text-green-600",
      hex: "#10B981",
      bgHex: "#10B98120",
    },
    "Bajo Stock": {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      hex: "#F59E0B",
      bgHex: "#F59E0B20",
    },
    Crítico: {
      bg: "bg-red-50",
      text: "text-red-600",
      hex: "#EF4444",
      bgHex: "#EF444420",
    },
    Agotado: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      hex: "#6B7280",
      bgHex: "#6B728020",
    },
  };
  return statusColors[estado] || statusColors["Normal"];
};

// Calcular el estado del stock basado en cantidad y mínimo
export const calculateStatus = (cantidad, minimo) => {
  if (cantidad === 0) {
    return "Agotado";
  }

  const porcentaje = (cantidad / minimo) * 100;

  if (porcentaje <= 50) {
    return "Crítico";
  } else if (porcentaje <= 100) {
    return "Bajo Stock";
  }

  return "Normal";
};

// Calcular el porcentaje de stock
export const calculateStockPercentage = (cantidad, minimo) => {
  if (minimo === 0) return 100;
  return Math.min((cantidad / minimo) * 100, 100);
};

// Formatear precio
export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(price);
};

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return "No especificada";
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Verificar si un producto está próximo a vencer (próximos 7 días)
export const isNearExpiration = (fechaVencimiento) => {
  if (!fechaVencimiento) return false;

  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diasParaVencer = Math.ceil(
    (vencimiento - hoy) / (1000 * 60 * 60 * 24)
  );

  return diasParaVencer <= 7 && diasParaVencer > 0;
};

// Verificar si un producto está vencido
export const isExpired = (fechaVencimiento) => {
  if (!fechaVencimiento) return false;
  return new Date(fechaVencimiento) < new Date();
};

// Obtener mensaje de alerta de vencimiento
export const getExpirationAlert = (fechaVencimiento) => {
  if (!fechaVencimiento) return null;

  const hoy = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diasParaVencer = Math.ceil(
    (vencimiento - hoy) / (1000 * 60 * 60 * 24)
  );

  if (diasParaVencer < 0) {
    return {
      message: "Producto vencido",
      type: "danger",
      icon: "⚠️",
    };
  } else if (diasParaVencer === 0) {
    return {
      message: "Vence hoy",
      type: "danger",
      icon: "⚠️",
    };
  } else if (diasParaVencer <= 3) {
    return {
      message: `Vence en ${diasParaVencer} día${diasParaVencer > 1 ? "s" : ""}`,
      type: "warning",
      icon: "⏰",
    };
  } else if (diasParaVencer <= 7) {
    return {
      message: `Vence en ${diasParaVencer} días`,
      type: "info",
      icon: "📅",
    };
  }

  return null;
};

// Validar cantidad (no negativa)
export const isValidQuantity = (cantidad) => {
  return cantidad !== null && cantidad !== undefined && cantidad >= 0;
};

// Validar precio (mayor a 0)
export const isValidPrice = (precio) => {
  return precio !== null && precio !== undefined && precio > 0;
};
