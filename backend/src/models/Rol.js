import mongoose from "mongoose";

const rolSchema = new mongoose.Schema(
  {
    // Restaurante al que pertenece
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
      index: true,
    },

    // Identificador único del rol (ej: "mesero", "cocinero", "gerente")
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Nombre visible del rol (ej: "Mesero", "Cocinero", "Gerente")
    label: {
      type: String,
      required: true,
      trim: true,
    },

    // Icono emoji del rol
    icon: {
      type: String,
      default: "👤",
    },

    // Permisos asignados al rol
    permisos: {
      type: [String],
      default: [],
    },

    // Orden de visualización
    orden: {
      type: Number,
      default: 0,
    },

    // Si está activo o no
    activo: {
      type: Boolean,
      default: true,
    },

    // Si es un rol predefinido del sistema (no se puede eliminar)
    predefinido: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto: cada restaurante tiene sus propios roles únicos por key
rolSchema.index({ restauranteId: 1, key: 1 }, { unique: true });

// Índice para ordenar los roles
rolSchema.index({ restauranteId: 1, orden: 1 });

const Rol = mongoose.model("Rol", rolSchema);

export default Rol;
