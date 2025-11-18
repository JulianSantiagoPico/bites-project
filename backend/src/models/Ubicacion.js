import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema(
  {
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "📍",
    },
    orden: {
      type: Number,
      default: 0,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    predefinida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para buscar por restaurante y key (único por restaurante)
ubicacionSchema.index({ restauranteId: 1, key: 1 }, { unique: true });

// Índice compuesto para ordenamiento
ubicacionSchema.index({ restauranteId: 1, orden: 1 });

export default mongoose.model("Ubicacion", ubicacionSchema);
