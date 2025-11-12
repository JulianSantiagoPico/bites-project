import mongoose from "mongoose";

const inventarioSchema = new mongoose.Schema(
  {
    // Información básica del producto
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },

    descripcion: {
      type: String,
      trim: true,
      default: null,
    },

    // Categorización
    categoria: {
      type: String,
      required: [true, "La categoría es requerida"],
      enum: {
        values: ["Carnes", "Vegetales", "Lácteos", "Bebidas", "Especias", "Otros"],
        message: "Categoría no válida",
      },
    },

    // Control de stock
    cantidad: {
      type: Number,
      required: [true, "La cantidad es requerida"],
      min: [0, "La cantidad no puede ser negativa"],
      default: 0,
    },

    unidadMedida: {
      type: String,
      required: [true, "La unidad de medida es requerida"],
      enum: {
        values: ["kg", "litros", "unidades", "cajas"],
        message: "Unidad de medida no válida",
      },
    },

    cantidadMinima: {
      type: Number,
      required: [true, "La cantidad mínima es requerida"],
      min: [0, "La cantidad mínima no puede ser negativa"],
      default: 0,
    },

    // Información de precio
    precioUnitario: {
      type: Number,
      required: [true, "El precio unitario es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },

    // Información del proveedor
    proveedor: {
      type: String,
      trim: true,
      default: null,
    },

    // Información adicional
    lote: {
      type: String,
      trim: true,
      default: null,
    },

    fechaVencimiento: {
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

    // Estado del item
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
inventarioSchema.index({ restauranteId: 1, categoria: 1 });
inventarioSchema.index({ restauranteId: 1, activo: 1 });
inventarioSchema.index({ restauranteId: 1, nombre: 1 });

// Virtual para calcular el estado del stock
inventarioSchema.virtual("estado").get(function () {
  if (this.cantidad === 0) {
    return "Agotado";
  }
  
  const porcentaje = (this.cantidad / this.cantidadMinima) * 100;
  
  if (porcentaje <= 50) {
    return "Crítico";
  } else if (porcentaje <= 100) {
    return "Bajo Stock";
  }
  
  return "Normal";
});

// Virtual para calcular el valor total del item
inventarioSchema.virtual("valorTotal").get(function () {
  return this.cantidad * this.precioUnitario;
});

// Virtual para verificar si está por vencer (próximos 7 días)
inventarioSchema.virtual("proximoAVencer").get(function () {
  if (!this.fechaVencimiento) {
    return false;
  }
  
  const hoy = new Date();
  const diasParaVencer = Math.ceil(
    (this.fechaVencimiento - hoy) / (1000 * 60 * 60 * 24)
  );
  
  return diasParaVencer <= 7 && diasParaVencer > 0;
});

// Virtual para verificar si está vencido
inventarioSchema.virtual("vencido").get(function () {
  if (!this.fechaVencimiento) {
    return false;
  }
  
  return this.fechaVencimiento < new Date();
});

// Método para obtener información pública del item
inventarioSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    nombre: this.nombre,
    descripcion: this.descripcion,
    categoria: this.categoria,
    cantidad: this.cantidad,
    unidadMedida: this.unidadMedida,
    cantidadMinima: this.cantidadMinima,
    precioUnitario: this.precioUnitario,
    proveedor: this.proveedor,
    lote: this.lote,
    fechaVencimiento: this.fechaVencimiento,
    restauranteId: this.restauranteId,
    activo: this.activo,
    estado: this.estado,
    valorTotal: this.valorTotal,
    proximoAVencer: this.proximoAVencer,
    vencido: this.vencido,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Método estático para obtener estadísticas del inventario
inventarioSchema.statics.getEstadisticas = async function (restauranteId) {
  const items = await this.find({ restauranteId, activo: true });
  
  const stats = {
    totalItems: items.length,
    itemsNormales: 0,
    itemsBajoStock: 0,
    itemsCriticos: 0,
    itemsAgotados: 0,
    valorTotalInventario: 0,
    itemsProximosAVencer: 0,
    itemsVencidos: 0,
  };
  
  items.forEach((item) => {
    // Calcular valores totales
    stats.valorTotalInventario += item.cantidad * item.precioUnitario;
    
    // Contar estados
    const estado = item.estado;
    if (estado === "Normal") stats.itemsNormales++;
    else if (estado === "Bajo Stock") stats.itemsBajoStock++;
    else if (estado === "Crítico") stats.itemsCriticos++;
    else if (estado === "Agotado") stats.itemsAgotados++;
    
    // Contar vencimientos
    if (item.proximoAVencer) stats.itemsProximosAVencer++;
    if (item.vencido) stats.itemsVencidos++;
  });
  
  return stats;
};

// Método estático para obtener alertas
inventarioSchema.statics.getAlertas = async function (restauranteId) {
  const items = await this.find({ restauranteId, activo: true });
  
  const alertas = {
    bajoStock: [],
    criticos: [],
    agotados: [],
    proximosAVencer: [],
    vencidos: [],
  };
  
  items.forEach((item) => {
    const itemData = item.toPublicJSON();
    
    // Alertas de stock
    if (item.estado === "Bajo Stock") alertas.bajoStock.push(itemData);
    else if (item.estado === "Crítico") alertas.criticos.push(itemData);
    else if (item.estado === "Agotado") alertas.agotados.push(itemData);
    
    // Alertas de vencimiento
    if (item.proximoAVencer) alertas.proximosAVencer.push(itemData);
    if (item.vencido) alertas.vencidos.push(itemData);
  });
  
  return alertas;
};

// Configurar para que los virtuals se incluyan en JSON
inventarioSchema.set("toJSON", { virtuals: true });
inventarioSchema.set("toObject", { virtuals: true });

const Inventario = mongoose.model("Inventario", inventarioSchema);

export default Inventario;
