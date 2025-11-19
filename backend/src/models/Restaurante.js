import mongoose from "mongoose";

const restauranteSchema = new mongoose.Schema(
  {
    // Información básica
    nombre: {
      type: String,
      required: [true, "El nombre del restaurante es requerido"],
      trim: true,
    },

    descripcion: {
      type: String,
      trim: true,
    },

    // Información de contacto
    telefono: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    // Dirección
    direccion: {
      calle: { type: String, trim: true },
      ciudad: { type: String, trim: true },
      estado: { type: String, trim: true },
      codigoPostal: { type: String, trim: true },
      pais: { type: String, trim: true, default: "Colombia" },
    },

    // Configuración del negocio
    logo: {
      type: String,
      default: null,
    },

    moneda: {
      type: String,
      default: "COP",
    },

    // Horarios
    horarios: {
      lunes: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      martes: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      miercoles: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      jueves: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      viernes: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      sabado: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
      domingo: {
        apertura: String,
        cierre: String,
        cerrado: { type: Boolean, default: false },
      },
    },

    // ID del administrador/dueño
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Se establece después de crear el usuario
    },

    // Estado
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
restauranteSchema.index({ adminId: 1 });
restauranteSchema.index({ nombre: 1 });

const Restaurante = mongoose.model("Restaurante", restauranteSchema);

export default Restaurante;
