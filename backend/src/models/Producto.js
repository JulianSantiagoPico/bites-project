import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    // Información básica del producto
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },

    descripcion: {
      type: String,
      trim: true,
      default: null,
    },

    // Categorización
    categoria: {
      type: String,
      required: [true, "La categoría es requerida"],
      enum: {
        values: ["Entradas", "Platos Fuertes", "Postres", "Bebidas", "Otros"],
        message: "Categoría no válida",
      },
    },

    // Precio
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },

    // Imagen (emoji o URL)
    imagen: {
      type: String,
      trim: true,
      default: "🍽️",
    },

    // Disponibilidad
    disponible: {
      type: Boolean,
      default: true,
    },

    // Producto destacado
    destacado: {
      type: Boolean,
      default: false,
    },

    // Tiempo de preparación en minutos
    tiempoPreparacion: {
      type: Number,
      min: [0, "El tiempo de preparación no puede ser negativo"],
      default: null,
    },

    // Tags para filtrado (vegetariano, picante, etc.)
    tags: {
      type: [String],
      default: [],
    },

    // Multi-tenant: Relación con restaurante
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: [true, "El restaurante es requerido"],
      index: true,
    },

    // Estado del producto (soft delete)
    activo: {
      type: Boolean,
      default: true,
    },

    // Auditoría
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    modificadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índices compuestos para optimizar búsquedas
productoSchema.index({ restauranteId: 1, nombre: 1 });
productoSchema.index({ restauranteId: 1, categoria: 1 });
productoSchema.index({ restauranteId: 1, disponible: 1 });
productoSchema.index({ restauranteId: 1, activo: 1 });
productoSchema.index({ restauranteId: 1, destacado: 1 });

// Virtual para verificar si está disponible y activo
productoSchema.virtual("estaDisponible").get(function () {
  return this.disponible && this.activo;
});

// Método para obtener JSON público (sin información sensible)
productoSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    descripcion: this.descripcion,
    categoria: this.categoria,
    precio: this.precio,
    imagen: this.imagen,
    disponible: this.disponible,
    destacado: this.destacado,
    tiempoPreparacion: this.tiempoPreparacion,
    tags: this.tags,
    activo: this.activo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Middleware pre-save para validaciones adicionales
productoSchema.pre("save", function (next) {
  // Convertir tags a minúsculas para consistencia
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map((tag) => tag.toLowerCase().trim());
  }

  next();
});

// Crear el modelo
const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
