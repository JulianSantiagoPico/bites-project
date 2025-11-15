import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema(
  {
    // Número de pedido único (auto-generado)
    numeroPedido: {
      type: String,
      required: true,
      unique: true,
    },

    // Mesa asociada al pedido
    mesaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mesa",
      required: [true, "La mesa es requerida"],
      index: true,
    },

    // Mesero que tomó el pedido
    meseroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El mesero es requerido"],
      index: true,
    },

    // Items del pedido
    items: [
      {
        productoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        nombre: {
          type: String,
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: [1, "La cantidad mínima es 1"],
        },
        precioUnitario: {
          type: Number,
          required: true,
          min: [0, "El precio no puede ser negativo"],
        },
        subtotal: {
          type: Number,
          required: true,
          min: [0, "El subtotal no puede ser negativo"],
        },
        notas: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],

    // Totales del pedido
    subtotal: {
      type: Number,
      required: true,
      min: [0, "El subtotal no puede ser negativo"],
    },

    impuestos: {
      type: Number,
      default: 0,
      min: [0, "Los impuestos no pueden ser negativos"],
    },

    propina: {
      type: Number,
      default: 0,
      min: [0, "La propina no puede ser negativa"],
    },

    total: {
      type: Number,
      required: true,
      min: [0, "El total no puede ser negativo"],
    },

    // Estado del pedido
    estado: {
      type: String,
      required: true,
      enum: {
        values: [
          "pendiente",
          "en_preparacion",
          "listo",
          "entregado",
          "cancelado",
        ],
        message: "Estado no válido",
      },
      default: "pendiente",
      index: true,
    },

    // Historial de cambios de estado
    historialEstados: [
      {
        estado: {
          type: String,
          required: true,
        },
        fechaCambio: {
          type: Date,
          default: Date.now,
        },
        cambiadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Información del cliente (opcional)
    nombreCliente: {
      type: String,
      trim: true,
      default: null,
    },

    // Notas generales del pedido
    notas: {
      type: String,
      trim: true,
      default: null,
    },

    // Fecha estimada de entrega
    fechaEstimadaEntrega: {
      type: Date,
      default: null,
    },

    // Fecha real de entrega
    fechaEntrega: {
      type: Date,
      default: null,
    },

    // Multi-tenant: Relación con restaurante
    restauranteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurante",
      required: [true, "El restaurante es requerido"],
      index: true,
    },

    // Estado del pedido (soft delete)
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
pedidoSchema.index({ restauranteId: 1, numeroPedido: 1 });
pedidoSchema.index({ restauranteId: 1, estado: 1 });
pedidoSchema.index({ restauranteId: 1, mesaId: 1 });
pedidoSchema.index({ restauranteId: 1, meseroId: 1 });
pedidoSchema.index({ restauranteId: 1, createdAt: -1 });
pedidoSchema.index({ restauranteId: 1, activo: 1 });

// Método para generar número de pedido único
pedidoSchema.statics.generarNumeroPedido = async function (restauranteId) {
  const fecha = new Date();
  const año = fecha.getFullYear().toString().slice(-2);
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  // Formato: P-YYMMDD-XXXX (ej: P-241114-0001)
  const prefijo = `P-${año}${mes}${dia}`;

  // Buscar el último pedido del día
  const ultimoPedido = await this.findOne({
    restauranteId,
    numeroPedido: new RegExp(`^${prefijo}`),
  }).sort({ numeroPedido: -1 });

  let secuencia = 1;
  if (ultimoPedido) {
    const ultimaSecuencia = parseInt(ultimoPedido.numeroPedido.split("-")[2]);
    secuencia = ultimaSecuencia + 1;
  }

  return `${prefijo}-${String(secuencia).padStart(4, "0")}`;
};

// Método para calcular totales
pedidoSchema.methods.calcularTotales = function (porcentajeImpuesto = 0) {
  // Primero asegurar que cada item tenga su subtotal calculado
  this.items.forEach((item) => {
    if (!item.subtotal || item.subtotal === 0) {
      item.subtotal = item.cantidad * item.precioUnitario;
    }
  });

  // Calcular subtotal del pedido
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  // Calcular impuestos
  this.impuestos = this.subtotal * (porcentajeImpuesto / 100);

  // Calcular total
  this.total = this.subtotal + this.impuestos + (this.propina || 0);

  return this.total;
};

// Método para obtener JSON público
pedidoSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    numeroPedido: this.numeroPedido,
    mesaId: this.mesaId,
    meseroId: this.meseroId,
    items: this.items,
    subtotal: this.subtotal,
    impuestos: this.impuestos,
    propina: this.propina,
    total: this.total,
    estado: this.estado,
    historialEstados: this.historialEstados,
    nombreCliente: this.nombreCliente,
    notas: this.notas,
    fechaEstimadaEntrega: this.fechaEstimadaEntrega,
    fechaEntrega: this.fechaEntrega,
    activo: this.activo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Middleware pre-save para calcular subtotales de items y totales
pedidoSchema.pre("save", function (next) {
  // Calcular subtotal de cada item
  this.items.forEach((item) => {
    item.subtotal = item.cantidad * item.precioUnitario;
  });

  // Calcular totales del pedido (esto ahora también recalcula subtotales si es necesario)
  this.calcularTotales();

  next();
});

// Middleware para agregar al historial cuando cambia el estado
pedidoSchema.pre("save", function (next) {
  if (this.isModified("estado")) {
    this.historialEstados.push({
      estado: this.estado,
      fechaCambio: new Date(),
      cambiadoPor: this.modificadoPor,
    });

    // Si el pedido se marca como entregado, guardar fecha de entrega
    if (this.estado === "entregado" && !this.fechaEntrega) {
      this.fechaEntrega = new Date();
    }
  }

  next();
});

// Crear el modelo
const Pedido = mongoose.model("Pedido", pedidoSchema);

export default Pedido;
