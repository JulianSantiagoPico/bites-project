import mongoose from "mongoose";

const ocasionSchema = new mongoose.Schema(
  {
    // Restaurante al que pertenece
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
      index: true,
    },

    // Identificador único de la ocasión (ej: "cumpleaños", "aniversario")
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Nombre visible de la ocasión (ej: "Cumpleaños", "Aniversario")
    label: {
      type: String,
      required: true,
      trim: true,
    },

    // Icono emoji de la ocasión
    icon: {
      type: String,
      default: "🎉",
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

    // Si es una ocasión predefinida del sistema (no se puede eliminar)
    predefinida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto: cada restaurante tiene sus propias ocasiones únicas por key
ocasionSchema.index({ restauranteId: 1, key: 1 }, { unique: true });

// Índice para ordenar las ocasiones
ocasionSchema.index({ restauranteId: 1, orden: 1 });

const Ocasion = mongoose.model("Ocasion", ocasionSchema);

export default Ocasion;
