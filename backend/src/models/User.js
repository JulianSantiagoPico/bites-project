import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../config/roles.js";

const userSchema = new mongoose.Schema(
  {
    // Información básica
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
    },

    apellido: {
      type: String,
      required: [true, "El apellido es requerido"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },

    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No incluir por defecto en las consultas
    },

    // Información del rol
    rol: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.ADMIN,
    },

    // Referencia al restaurante (el admin crea su restaurante al registrarse)
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
    },

    // Información adicional
    telefono: {
      type: String,
      trim: true,
    },

    foto: {
      type: String,
      default: null,
    },

    // Estado del usuario
    activo: {
      type: Boolean,
      default: true,
    },

    // Información de auditoría
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ultimoAcceso: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índices para optimizar búsquedas
userSchema.index({ email: 1, restauranteId: 1 });
userSchema.index({ restauranteId: 1, rol: 1 });

// Middleware pre-save para hashear contraseña
userSchema.pre("save", async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener información pública del usuario
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    apellido: this.apellido,
    email: this.email,
    rol: this.rol,
    restauranteId: this.restauranteId,
    telefono: this.telefono,
    foto: this.foto,
    activo: this.activo,
    ultimoAcceso: this.ultimoAcceso,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Virtual para nombre completo
userSchema.virtual("nombreCompleto").get(function () {
  return `${this.nombre} ${this.apellido}`;
});

const User = mongoose.model("User", userSchema);

export default User;
