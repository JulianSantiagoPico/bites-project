import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema(
  {
    // Información del cliente
    nombreCliente: {
      type: String,
      required: [true, "El nombre del cliente es requerido"],
      trim: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },

    telefonoCliente: {
      type: String,
      required: [true, "El teléfono del cliente es requerido"],
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
        "Por favor ingrese un número de teléfono válido",
      ],
    },

    emailCliente: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingrese un email válido",
      ],
    },

    // Detalles de la reserva
    fecha: {
      type: Date,
      required: [true, "La fecha de la reserva es requerida"],
      index: true,
    },

    hora: {
      type: String,
      required: [true, "La hora de la reserva es requerida"],
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"],
    },

    numeroPersonas: {
      type: Number,
      required: [true, "El número de personas es requerido"],
      min: [1, "Debe haber al menos 1 persona"],
      max: [30, "El número máximo de personas es 30"],
    },

    // Mesa asignada (opcional hasta que se confirme)
    mesaAsignada: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mesa",
      default: null,
    },

    // Estado de la reserva
    estado: {
      type: String,
      enum: {
        values: [
          "pendiente",
          "confirmada",
          "sentada",
          "completada",
          "cancelada",
          "no_show",
        ],
        message: "{VALUE} no es un estado válido",
      },
      default: "pendiente",
      index: true,
    },

    // Notas especiales
    notas: {
      type: String,
      maxlength: [500, "Las notas no pueden exceder 500 caracteres"],
    },

    // Ocasión especial
    ocasion: {
      type: String,
      enum: ["ninguna", "cumpleaños", "aniversario", "cita", "negocio", "otro"],
      default: "ninguna",
    },

    // Restaurante (multi-tenancy)
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: true,
      index: true,
    },

    // Estado activo (soft delete)
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Auditoría
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    modificadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Índices compuestos para consultas frecuentes
reservaSchema.index({ restauranteId: 1, fecha: 1, estado: 1 });
reservaSchema.index({ restauranteId: 1, mesaAsignada: 1 });
reservaSchema.index({ restauranteId: 1, activo: 1, fecha: 1 });

// Virtual para obtener fecha y hora combinadas
reservaSchema.virtual("fechaHoraCompleta").get(function () {
  const fecha = new Date(this.fecha);
  const [horas, minutos] = this.hora.split(":");
  fecha.setHours(parseInt(horas), parseInt(minutos));
  return fecha;
});

// Método para validar si la reserva es para hoy
reservaSchema.methods.esHoy = function () {
  const hoy = new Date();
  const fechaReserva = new Date(this.fecha);
  return (
    hoy.getDate() === fechaReserva.getDate() &&
    hoy.getMonth() === fechaReserva.getMonth() &&
    hoy.getFullYear() === fechaReserva.getFullYear()
  );
};

// Método para validar si la reserva ya pasó
reservaSchema.methods.haPasado = function () {
  const ahora = new Date();
  return this.fechaHoraCompleta < ahora;
};

// Método para serializar datos públicos
reservaSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    nombreCliente: this.nombreCliente,
    telefonoCliente: this.telefonoCliente,
    emailCliente: this.emailCliente,
    fecha: this.fecha,
    hora: this.hora,
    numeroPersonas: this.numeroPersonas,
    mesaAsignada: this.mesaAsignada,
    estado: this.estado,
    notas: this.notas,
    ocasion: this.ocasion,
    activo: this.activo,
    creadoPor: this.creadoPor,
    modificadoPor: this.modificadoPor,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Middleware pre-save para validar fecha futura
reservaSchema.pre("save", function (next) {
  // Solo validar si es una nueva reserva o si la fecha cambió
  if (this.isNew || this.isModified("fecha") || this.isModified("hora")) {
    const ahora = new Date();
    const fechaReserva = this.fechaHoraCompleta;

    // Permitir actualizar reservas pasadas (para cambiar estado)
    // pero no crear nuevas en el pasado
    if (this.isNew && fechaReserva < ahora) {
      return next(new Error("No se pueden crear reservas para fechas pasadas"));
    }
  }

  next();
});

const Reserva = mongoose.model("Reserva", reservaSchema);

export default Reserva;
