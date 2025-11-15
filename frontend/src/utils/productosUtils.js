/**
 * Utilidades para el módulo de Productos
 * Helpers, formatters y funciones auxiliares
 */

// Iconos por categoría
export const getCategoryIcon = (categoria) => {
  const icons = {
    Entradas: "🍽️",
    "Platos Fuertes": "🍖",
    Postres: "🍰",
    Bebidas: "🥤",
    Otros: "📦",
  };
  return icons[categoria] || "🍽️";
};

// Colores para disponibilidad
export const getDisponibilidadColor = (disponible) => {
  if (disponible) {
    return {
      bg: "bg-success/20",
      text: "text-success",
      hex: "#6bbf59",
      label: "Disponible",
    };
  }
  return {
    bg: "bg-error/20",
    text: "text-error",
    hex: "#a4161a",
    label: "No Disponible",
  };
};

// Colores para estado activo/inactivo
export const getStatusColor = (activo) => {
  if (activo) {
    return {
      bg: "bg-success/20",
      text: "text-success",
      hex: "#6bbf59",
      label: "Activo",
    };
  }
  return {
    bg: "bg-gray-200",
    text: "text-gray-600",
    hex: "#9ca3af",
    label: "Inactivo",
  };
};

// Formatear precio
export const formatPrice = (price) => {
  if (price === null || price === undefined) return "$0.00";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(price);
};

// Formatear tiempo de preparación
export const formatTiempoPreparacion = (minutos) => {
  if (!minutos || minutos === 0) return "Inmediato";
  if (minutos === 1) return "1 minuto";
  return `${minutos} minutos`;
};

// Obtener clase de badge para destacado
export const getDestacadoBadge = (destacado) => {
  if (destacado) {
    return {
      bg: "bg-accent/20",
      text: "text-accent",
      label: "⭐ Destacado",
    };
  }
  return null;
};

// Categorías disponibles
export const CATEGORIAS = [
  { value: "Todo", label: "📦 Todas las Categorías" },
  { value: "Entradas", label: "🍽️ Entradas" },
  { value: "Platos Fuertes", label: "🍖 Platos Fuertes" },
  { value: "Postres", label: "🍰 Postres" },
  { value: "Bebidas", label: "🥤 Bebidas" },
  { value: "Otros", label: "📦 Otros" },
];

// Opciones de categorías para el formulario (sin "Todo")
export const CATEGORIAS_FORM = CATEGORIAS.filter((cat) => cat.value !== "Todo");

// Tags sugeridos
export const TAGS_SUGERIDOS = [
  "vegetariano",
  "vegano",
  "picante",
  "dulce",
  "salado",
  "sin gluten",
  "bajo en calorías",
  "popular",
  "tradicional",
  "gourmet",
  "fresco",
  "saludable",
  "orgánico",
  "especial del día",
];

// Filtrar productos por búsqueda y categoría
export const filterProductos = (productos, searchTerm, categoria) => {
  return productos.filter((producto) => {
    // Filtro por búsqueda
    const matchesSearch =
      searchTerm === "" ||
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.descripcion &&
        producto.descripcion
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (producto.tags &&
        producto.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    // Filtro por categoría
    const matchesCategory =
      categoria === "Todo" || producto.categoria === categoria;

    return matchesSearch && matchesCategory;
  });
};

// Calcular estadísticas de productos
export const calculateStats = (productos) => {
  const total = productos.length;
  const disponibles = productos.filter((p) => p.disponible && p.activo).length;
  const noDisponibles = productos.filter(
    (p) => !p.disponible && p.activo
  ).length;
  const destacados = productos.filter((p) => p.destacado && p.activo).length;
  const inactivos = productos.filter((p) => !p.activo).length;

  return {
    total,
    disponibles,
    noDisponibles,
    destacados,
    inactivos,
  };
};

// Validar datos del formulario
export const validateProductoForm = (formData) => {
  const errors = {};

  if (!formData.nombre || formData.nombre.trim() === "") {
    errors.nombre = "El nombre es requerido";
  } else if (formData.nombre.length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres";
  }

  if (!formData.categoria) {
    errors.categoria = "La categoría es requerida";
  }

  if (formData.precio === "" || formData.precio === null) {
    errors.precio = "El precio es requerido";
  } else if (parseFloat(formData.precio) < 0) {
    errors.precio = "El precio no puede ser negativo";
  }

  if (
    formData.tiempoPreparacion &&
    parseFloat(formData.tiempoPreparacion) < 0
  ) {
    errors.tiempoPreparacion = "El tiempo de preparación no puede ser negativo";
  }

  return errors;
};

// Formatear fecha de creación/actualización
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Formatear fecha y hora
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Obtener color de badge para tags
export const getTagColor = (tag) => {
  const colors = {
    vegetariano: "bg-green-100 text-green-700",
    vegano: "bg-green-200 text-green-800",
    picante: "bg-red-100 text-red-700",
    dulce: "bg-pink-100 text-pink-700",
    salado: "bg-yellow-100 text-yellow-700",
    "sin gluten": "bg-blue-100 text-blue-700",
    "bajo en calorías": "bg-purple-100 text-purple-700",
    popular: "bg-accent/20 text-accent",
    tradicional: "bg-secondary/20 text-secondary",
    gourmet: "bg-primary/20 text-primary",
    fresco: "bg-cyan-100 text-cyan-700",
    saludable: "bg-lime-100 text-lime-700",
    orgánico: "bg-emerald-100 text-emerald-700",
    "especial del día": "bg-orange-100 text-orange-700",
  };

  return colors[tag.toLowerCase()] || "bg-gray-100 text-gray-700";
};
