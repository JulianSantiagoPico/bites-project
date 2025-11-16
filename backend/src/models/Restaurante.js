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

    // Roles personalizados del restaurante
    customRoles: {
      type: Map,
      of: String,
      default: {},
    },

    // Iconos para los roles personalizados
    rolesIcons: {
      type: Map,
      of: String,
      default: {},
    },

    // Permisos personalizados por rol
    customRolePermissions: {
      type: Map,
      of: [String],
      default: {},
    },

    // Ocasiones personalizadas del restaurante
    customOcasiones: {
      type: Map,
      of: String,
      default: {},
    },

    // Iconos para las ocasiones personalizadas
    ocasionesIcons: {
      type: Map,
      of: String,
      default: {},
    },

    // Ubicaciones personalizadas del restaurante
    customUbicaciones: {
      type: Map,
      of: String,
      default: {},
    },

    // Iconos para las ubicaciones personalizadas
    ubicacionesIcons: {
      type: Map,
      of: String,
      default: {},
    },

    // Categorías personalizadas del restaurante
    customCategorias: {
      type: Map,
      of: String,
      default: {},
    },

    // Iconos para las categorías personalizadas
    categoriasIcons: {
      type: Map,
      of: String,
      default: {},
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
