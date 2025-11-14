import mongoose from "mongoose";

const mesaSchema = new mongoose.Schema(
  {
    // Número de la mesa (único por restaurante)
    numero: {
      type: Number,
      required: [true, "El número de mesa es requerido"],
      min: [1, "El número de mesa debe ser mayor a 0"],
    },

    // Capacidad de personas
    capacidad: {
      type: Number,
      required: [true, "La capacidad es requerida"],
      min: [1, "La capacidad mínima es 1 persona"],
      max: [20, "La capacidad máxima es 20 personas"],
    },

    // Ubicación en el restaurante
    ubicacion: {
      type: String,
      required: [true, "La ubicación es requerida"],
      enum: {
        values: ["Interior", "Terraza", "Bar", "VIP"],
        message: "Ubicación no válida",
      },
    },

    // Estado actual de la mesa
    estado: {
      type: String,
      required: true,
      enum: {
        values: ["disponible", "ocupada", "reservada", "en_limpieza"],
        message: "Estado no válido",
      },
      default: "disponible",
    },

    // Mesero asignado a esta mesa (opcional)
    meseroAsignado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Notas adicionales
    notas: {
      type: String,
      trim: true,
      default: null,
    },

    // Multi-tenant: Relación con restaurante
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: [true, "El restaurante es requerido"],
      index: true,
    },

    // Estado activo/inactivo
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
mesaSchema.index({ restauranteId: 1, numero: 1 }, { unique: true }); // Número único por restaurante
mesaSchema.index({ restauranteId: 1, estado: 1 });
mesaSchema.index({ restauranteId: 1, activo: 1 });
mesaSchema.index({ restauranteId: 1, ubicacion: 1 });
mesaSchema.index({ meseroAsignado: 1 });

// Virtual para verificar si está disponible
mesaSchema.virtual("estaDisponible").get(function () {
  return this.estado === "disponible" && this.activo;
});

// Virtual para obtener información resumida del estado
mesaSchema.virtual("estadoInfo").get(function () {
  const estadosInfo = {
    disponible: { color: "green", texto: "Disponible", icon: "✓" },
    ocupada: { color: "red", texto: "Ocupada", icon: "●" },
    reservada: { color: "blue", texto: "Reservada", icon: "◉" },
    en_limpieza: { color: "yellow", texto: "En Limpieza", icon: "◐" },
  };

  return estadosInfo[this.estado] || estadosInfo.disponible;
});

// Método para obtener información pública de la mesa
mesaSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    numero: this.numero,
    capacidad: this.capacidad,
    ubicacion: this.ubicacion,
    estado: this.estado,
    meseroAsignado: this.meseroAsignado,
    notas: this.notas,
    restauranteId: this.restauranteId,
    activo: this.activo,
    creadoPor: this.creadoPor,
    modificadoPor: this.modificadoPor,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Middleware pre-save para validaciones personalizadas
mesaSchema.pre("save", async function (next) {
  // Si se asigna un mesero, verificar que existe y es mesero
  if (this.meseroAsignado && this.isModified("meseroAsignado")) {
    const User = mongoose.model("User");
    const mesero = await User.findOne({
      _id: this.meseroAsignado,
      rol: "mesero",
      activo: true,
      restauranteId: this.restauranteId,
    });

    if (!mesero) {
      const error = new Error(
        "El mesero asignado no existe o no es un mesero válido"
      );
      return next(error);
    }
  }

  next();
});

// Configurar virtuals en JSON
mesaSchema.set("toJSON", { virtuals: true });
mesaSchema.set("toObject", { virtuals: true });

const Mesa = mongoose.model("Mesa", mesaSchema);

export default Mesa;
