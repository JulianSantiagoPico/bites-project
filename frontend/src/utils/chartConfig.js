/**
 * Configuración de colores y estilos para gráficos Recharts
 * Mantiene consistencia con la paleta de colores del proyecto
 */

// Paleta de colores del proyecto
export const CHART_COLORS = {
  primary: "#581845", // Morado oscuro
  secondary: "#35524a", // Verde oscuro
  accent: "#e6af2e", // Amarillo dorado
  success: "#6bbf59", // Verde
  warning: "#ffd166", // Amarillo advertencia
  error: "#a4161a", // Rojo
  info: "#3b82f6", // Azul
  purple: "#8b5cf6", // Morado claro
  teal: "#14b8a6", // Verde azulado
  pink: "#ec4899", // Rosa
  orange: "#f97316", // Naranja
  indigo: "#6366f1", // Índigo
};

// Array de colores para gráficos con múltiples series
export const CHART_COLOR_ARRAY = [
  CHART_COLORS.primary,
  CHART_COLORS.accent,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
  CHART_COLORS.pink,
  CHART_COLORS.orange,
  CHART_COLORS.warning,
];

// Estilos para tooltips
export const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    padding: "12px",
  },
  labelStyle: {
    color: "#4a4a4a",
    fontWeight: "600",
    marginBottom: "8px",
  },
  itemStyle: {
    color: "#7d7d7d",
    padding: "4px 0",
  },
};

// Estilos para leyendas
export const LEGEND_STYLES = {
  iconType: "circle",
  iconSize: 10,
  wrapperStyle: {
    paddingTop: "20px",
  },
};

// Configuración de grid/cuadrícula
export const GRID_STYLES = {
  stroke: "#e5e7eb",
  strokeDasharray: "3 3",
  opacity: 0.5,
};

// Estilos para ejes
export const AXIS_STYLES = {
  tick: {
    fill: "#7d7d7d",
    fontSize: 12,
  },
  line: {
    stroke: "#d1d5db",
  },
};

// Configuración responsive para gráficos
export const RESPONSIVE_CHART_CONFIG = {
  small: {
    height: 250,
    fontSize: 11,
  },
  medium: {
    height: 300,
    fontSize: 12,
  },
  large: {
    height: 400,
    fontSize: 13,
  },
};

// Configuración de animación
export const ANIMATION_CONFIG = {
  animationBegin: 0,
  animationDuration: 800,
  animationEasing: "ease-out",
};

// Formatear moneda
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatear número
export const formatNumber = (value) => {
  return new Intl.NumberFormat("es-CO").format(value);
};

// Formatear porcentaje
export const formatPercentage = (value) => {
  return `${parseFloat(value).toFixed(1)}%`;
};

// Formatear fecha corta
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-CO", {
    month: "short",
    day: "numeric",
  });
};

// Formatear hora
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Configuración predeterminada para Line Charts
export const LINE_CHART_CONFIG = {
  type: "monotone",
  strokeWidth: 2,
  dot: { r: 4 },
  activeDot: { r: 6 },
};

// Configuración predeterminada para Bar Charts
export const BAR_CHART_CONFIG = {
  radius: [8, 8, 0, 0],
  maxBarSize: 60,
};

// Configuración predeterminada para Area Charts
export const AREA_CHART_CONFIG = {
  type: "monotone",
  strokeWidth: 2,
  fillOpacity: 0.6,
};

// Configuración predeterminada para Pie Charts
export const PIE_CHART_CONFIG = {
  cx: "50%",
  cy: "50%",
  innerRadius: "60%",
  outerRadius: "80%",
  paddingAngle: 2,
};
