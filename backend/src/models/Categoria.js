import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema(
  {
    // Restaurante al que pertenece
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
      index: true,
    },

    // Identificador único de la categoría (ej: "entradas", "platos_fuertes")
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Nombre visible de la categoría (ej: "Entradas", "Platos Fuertes")
    label: {
      type: String,
      required: true,
      trim: true,
    },

    // Icono emoji de la categoría
    icon: {
      type: String,
      default: "📦",
    },

    // Orden de visualización
    orden: {
      type: Number,
      default: 0,
    },

    // Si está activa o no
    activo: {
      type: Boolean,
      default: true,
    },

    // Si es una categoría predefinida del sistema (no se puede eliminar)
    predefinida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto: cada restaurante tiene sus propias categorías únicas por key
categoriaSchema.index({ restauranteId: 1, key: 1 }, { unique: true });

// Índice para ordenar las categorías
categoriaSchema.index({ restauranteId: 1, orden: 1 });

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
