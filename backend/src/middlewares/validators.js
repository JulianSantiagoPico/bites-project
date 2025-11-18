import { body, validationResult } from "express-validator";
import Restaurante from "../models/Restaurante.js";
import Ocasion from "../models/Ocasion.js";
import Ubicacion from "../models/Ubicacion.js";

// Middleware para manejar los resultados de validación
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array().map((err) => ({
        path: err.path,
        msg: err.msg,
        field: err.path, // Mantener por compatibilidad
        message: err.msg, // Mantener por compatibilidad
      })),
    });
  }

  next();
};

// Validaciones para registro
export const validateRegister = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("restaurante.nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del restaurante es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre del restaurante debe tener al menos 2 caracteres"),

  handleValidationErrors,
];

// Validaciones para login
export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),

  handleValidationErrors,
];

// Validaciones para crear empleado
export const validateCreateEmployee = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .notEmpty()
    .withMessage("El rol es requerido")
    .custom(async (value, { req }) => {
      try {
        // Obtener roles del restaurante
        const restaurante = await Restaurante.findById(req.user.restauranteId);

        if (!restaurante) {
          throw new Error("Restaurante no encontrado");
        }

        // Roles predeterminados
        const defaultRoles = ["mesero", "cocinero", "cajero", "gerente"];

        // Roles personalizados del restaurante (convertir Map a array de keys)
        let customRoles = [];
        if (restaurante.customRoles) {
          if (restaurante.customRoles instanceof Map) {
            customRoles = Array.from(restaurante.customRoles.keys());
          } else if (typeof restaurante.customRoles === "object") {
            customRoles = Object.keys(restaurante.customRoles);
          }
        }

        // Combinar roles predeterminados y personalizados
        const validRoles = [...defaultRoles, ...customRoles];

        if (!validRoles.includes(value)) {
          throw new Error(
            `Rol inválido. Roles válidos: ${validRoles.join(", ")}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error en validación de rol:", error);
        throw error;
      }
    }),

  body("telefono")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("El teléfono debe tener entre 10 y 15 dígitos")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage(
      "El teléfono solo puede contener números, +, -, espacios y paréntesis"
    ),

  handleValidationErrors,
];

// Validaciones para actualizar usuario
export const validateUpdateUser = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),

  body("telefono")
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("El teléfono debe tener entre 10 y 15 dígitos")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage(
      "El teléfono solo puede contener números, +, -, espacios y paréntesis"
    ),

  body("rol")
    .optional()
    .custom(async (value, { req }) => {
      try {
        // Obtener roles del restaurante
        const restaurante = await Restaurante.findById(req.user.restauranteId);

        if (!restaurante) {
          throw new Error("Restaurante no encontrado");
        }

        // Roles predeterminados (incluir admin para validación)
        const defaultRoles = [
          "admin",
          "mesero",
          "cocinero",
          "cajero",
          "gerente",
        ];

        // Roles personalizados del restaurante (convertir Map a array de keys)
        let customRoles = [];
        if (restaurante.customRoles) {
          if (restaurante.customRoles instanceof Map) {
            customRoles = Array.from(restaurante.customRoles.keys());
          } else if (typeof restaurante.customRoles === "object") {
            customRoles = Object.keys(restaurante.customRoles);
          }
        }

        // Combinar roles predeterminados y personalizados
        const validRoles = [...defaultRoles, ...customRoles];

        if (!validRoles.includes(value)) {
          throw new Error(
            `Rol inválido. Roles válidos: ${validRoles.join(", ")}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error en validación de rol:", error);
        throw error;
      }
    }),

  handleValidationErrors,
];

// Validaciones para crear item de inventario
export const validateCreateInventario = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),

  body("categoria")
    .notEmpty()
    .withMessage("La categoría es requerida")
    .isIn(["Carnes", "Vegetales", "Lácteos", "Bebidas", "Especias", "Otros"])
    .withMessage("Categoría no válida"),

  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es requerida")
    .isFloat({ min: 0 })
    .withMessage("La cantidad debe ser un número mayor o igual a 0"),

  body("unidadMedida")
    .notEmpty()
    .withMessage("La unidad de medida es requerida")
    .isIn(["kg", "litros", "unidades", "cajas"])
    .withMessage("Unidad de medida no válida"),

  body("cantidadMinima")
    .notEmpty()
    .withMessage("La cantidad mínima es requerida")
    .isFloat({ min: 0 })
    .withMessage("La cantidad mínima debe ser un número mayor o igual a 0"),

  body("precioUnitario")
    .notEmpty()
    .withMessage("El precio unitario es requerido")
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número mayor o igual a 0"),

  body("proveedor")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("El proveedor no puede exceder 100 caracteres"),

  body("lote")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("El lote no puede exceder 50 caracteres"),

  body("fechaVencimiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha de vencimiento inválida"),

  handleValidationErrors,
];

// Validaciones para actualizar item de inventario
export const validateUpdateInventario = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),

  body("categoria")
    .optional()
    .isIn(["Carnes", "Vegetales", "Lácteos", "Bebidas", "Especias", "Otros"])
    .withMessage("Categoría no válida"),

  body("cantidad")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La cantidad debe ser un número mayor o igual a 0"),

  body("unidadMedida")
    .optional()
    .isIn(["kg", "litros", "unidades", "cajas"])
    .withMessage("Unidad de medida no válida"),

  body("cantidadMinima")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La cantidad mínima debe ser un número mayor o igual a 0"),

  body("precioUnitario")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio unitario debe ser un número mayor o igual a 0"),

  body("proveedor")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("El proveedor no puede exceder 100 caracteres"),

  body("lote")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("El lote no puede exceder 50 caracteres"),

  body("fechaVencimiento")
    .optional()
    .isISO8601()
    .withMessage("Fecha de vencimiento inválida"),

  handleValidationErrors,
];

// Validaciones para ajuste de stock
export const validateStockAdjustment = [
  body("tipo")
    .notEmpty()
    .withMessage("El tipo de ajuste es requerido")
    .isIn(["entrada", "salida"])
    .withMessage("Tipo de ajuste inválido. Debe ser 'entrada' o 'salida'"),

  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es requerida")
    .isFloat({ min: 0.01 })
    .withMessage("La cantidad debe ser un número mayor a 0"),

  body("motivo")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("El motivo no puede exceder 200 caracteres"),

  handleValidationErrors,
];

// Validaciones para crear mesa
export const validateCreateMesa = [
  body("numero")
    .notEmpty()
    .withMessage("El número de mesa es requerido")
    .isInt({ min: 1 })
    .withMessage("El número de mesa debe ser un entero mayor a 0"),

  body("capacidad")
    .notEmpty()
    .withMessage("La capacidad es requerida")
    .isInt({ min: 1, max: 20 })
    .withMessage("La capacidad debe estar entre 1 y 20 personas"),

  body("ubicacion")
    .notEmpty()
    .withMessage("La ubicación es requerida")
    .custom(async (value, { req }) => {
      // Buscar en la colección Ubicacion
      const ubicacionExiste = await Ubicacion.findOne({
        restauranteId: req.user.restauranteId,
        key: value,
        activo: true,
      });

      if (!ubicacionExiste) {
        throw new Error("Ubicación no válida o inactiva");
      }

      return true;
    }),

  body("estado")
    .optional()
    .isIn(["disponible", "ocupada", "reservada", "en_limpieza"])
    .withMessage("Estado no válido"),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  handleValidationErrors,
];

// Validaciones para actualizar mesa
export const validateUpdateMesa = [
  body("numero")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El número de mesa debe ser un entero mayor a 0"),

  body("capacidad")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("La capacidad debe estar entre 1 y 20 personas"),

  body("ubicacion")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;

      // Buscar en la colección Ubicacion
      const ubicacionExiste = await Ubicacion.findOne({
        restauranteId: req.user.restauranteId,
        key: value,
        activo: true,
      });

      if (!ubicacionExiste) {
        throw new Error("Ubicación no válida o inactiva");
      }

      return true;
    }),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  handleValidationErrors,
];

// Validaciones para cambiar estado de mesa
export const validateChangeEstado = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn(["disponible", "ocupada", "reservada", "en_limpieza"])
    .withMessage("Estado no válido"),

  handleValidationErrors,
];

// Validaciones para asignar mesero
export const validateAsignarMesero = [
  body("meseroId").optional().isMongoId().withMessage("ID de mesero inválido"),

  handleValidationErrors,
];

// ==================== VALIDACIONES PARA RESERVAS ====================

// Validaciones para crear reserva
export const validateCreateReserva = [
  body("nombreCliente")
    .trim()
    .notEmpty()
    .withMessage("El nombre del cliente es requerido")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder 100 caracteres"),

  body("telefonoCliente")
    .trim()
    .notEmpty()
    .withMessage("El teléfono del cliente es requerido")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Formato de teléfono inválido"),

  body("emailCliente")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("fecha")
    .notEmpty()
    .withMessage("La fecha es requerida")
    .isISO8601()
    .withMessage("Formato de fecha inválido"),

  body("hora")
    .notEmpty()
    .withMessage("La hora es requerida")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Formato de hora inválido (HH:MM)"),

  body("numeroPersonas")
    .notEmpty()
    .withMessage("El número de personas es requerido")
    .isInt({ min: 1, max: 30 })
    .withMessage("El número de personas debe estar entre 1 y 30"),

  body("mesaAsignada")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("ID de mesa inválido"),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  body("ocasion")
    .optional()
    .custom(async (value, { req }) => {
      try {
        // Ocasiones predeterminadas del sistema
        const defaultOcasiones = ["ninguna", "otro"];

        // Si es una ocasión predeterminada, es válida
        if (defaultOcasiones.includes(value)) {
          return true;
        }

        // Buscar la ocasión en la colección Ocasion
        const ocasion = await Ocasion.findOne({
          restauranteId: req.user.restauranteId,
          key: value,
          activo: true,
        });

        if (!ocasion) {
          // Obtener todas las ocasiones válidas para el mensaje de error
          const ocasiones = await Ocasion.find({
            restauranteId: req.user.restauranteId,
            activo: true,
          });

          const validOcasiones = [
            ...defaultOcasiones,
            ...ocasiones.map((o) => o.key),
          ];

          throw new Error(
            `Ocasión inválida. Ocasiones válidas: ${validOcasiones.join(", ")}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error en validación de ocasión:", error);
        throw error;
      }
    }),

  handleValidationErrors,
];

// Validaciones para actualizar reserva
export const validateUpdateReserva = [
  body("nombreCliente")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre del cliente no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder 100 caracteres"),

  body("telefonoCliente")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El teléfono no puede estar vacío")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    )
    .withMessage("Formato de teléfono inválido"),

  body("emailCliente")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("fecha").optional().isISO8601().withMessage("Formato de fecha inválido"),

  body("hora")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Formato de hora inválido (HH:MM)"),

  body("numeroPersonas")
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage("El número de personas debe estar entre 1 y 30"),

  body("mesaAsignada")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("ID de mesa inválido"),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  body("ocasion")
    .optional()
    .custom(async (value, { req }) => {
      try {
        // Obtener ocasiones del restaurante
        const restaurante = await Restaurante.findById(req.user.restauranteId);

        if (!restaurante) {
          throw new Error("Restaurante no encontrado");
        }

        // Ocasiones predeterminadas
        const defaultOcasiones = [
          "ninguna",
          "cumpleaños",
          "aniversario",
          "cita",
          "negocio",
          "otro",
        ];

        // Ocasiones personalizadas del restaurante (convertir Map a array de keys)
        let customOcasiones = [];
        if (restaurante.customOcasiones) {
          if (restaurante.customOcasiones instanceof Map) {
            customOcasiones = Array.from(restaurante.customOcasiones.keys());
          } else if (typeof restaurante.customOcasiones === "object") {
            customOcasiones = Object.keys(restaurante.customOcasiones);
          }
        }

        // Combinar ocasiones predeterminadas y personalizadas
        const validOcasiones = [...defaultOcasiones, ...customOcasiones];

        if (!validOcasiones.includes(value)) {
          throw new Error(
            `Ocasión inválida. Ocasiones válidas: ${validOcasiones.join(", ")}`
          );
        }

        return true;
      } catch (error) {
        console.error("Error en validación de ocasión:", error);
        throw error;
      }
    }),

  handleValidationErrors,
];

// Validaciones para cambiar estado de reserva
export const validateChangeEstadoReserva = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn([
      "pendiente",
      "confirmada",
      "sentada",
      "completada",
      "cancelada",
      "no_show",
    ])
    .withMessage("Estado no válido"),

  handleValidationErrors,
];

// Validaciones para asignar mesa a reserva
export const validateAsignarMesaReserva = [
  body("mesaId")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("ID de mesa inválido"),

  handleValidationErrors,
];

// ============================================
// VALIDACIONES DE PRODUCTOS
// ============================================

// Validaciones para crear producto
export const validateCreateProducto = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder 100 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),

  body("categoria")
    .notEmpty()
    .withMessage("La categoría es requerida")
    .custom(async (value, { req }) => {
      const restaurante = await Restaurante.findById(req.user.restauranteId);
      if (!restaurante) {
        throw new Error("Restaurante no encontrado");
      }

      // Categorías por defecto
      const defaultCategorias = [
        "entradas",
        "platos_fuertes",
        "postres",
        "bebidas",
        "extras",
      ];

      // Obtener categorías personalizadas
      let customCategorias = [];
      if (restaurante.customCategorias) {
        if (restaurante.customCategorias instanceof Map) {
          customCategorias = Array.from(restaurante.customCategorias.keys());
        } else if (typeof restaurante.customCategorias === "object") {
          customCategorias = Object.keys(restaurante.customCategorias);
        }
      }

      // Combinar categorías
      const validCategorias = [...defaultCategorias, ...customCategorias];

      if (!validCategorias.includes(value)) {
        throw new Error("Categoría no válida");
      }

      return true;
    }),

  body("precio")
    .notEmpty()
    .withMessage("El precio es requerido")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("imagen")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La imagen no puede exceder 500 caracteres"),

  body("disponible")
    .optional()
    .isBoolean()
    .withMessage("Disponible debe ser un valor booleano"),

  body("destacado")
    .optional()
    .isBoolean()
    .withMessage("Destacado debe ser un valor booleano"),

  body("tiempoPreparacion")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "El tiempo de preparación debe ser un número entero mayor o igual a 0"
    ),

  body("tags").optional().isArray().withMessage("Tags debe ser un array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Cada tag no puede exceder 50 caracteres"),

  handleValidationErrors,
];

// Validaciones para actualizar producto
export const validateUpdateProducto = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede exceder 100 caracteres"),

  body("descripcion")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),

  body("categoria")
    .optional()
    .custom(async (value, { req }) => {
      if (!value) return true;

      const restaurante = await Restaurante.findById(req.user.restauranteId);
      if (!restaurante) {
        throw new Error("Restaurante no encontrado");
      }

      // Categorías por defecto
      const defaultCategorias = [
        "entradas",
        "platos_fuertes",
        "postres",
        "bebidas",
        "extras",
      ];

      // Obtener categorías personalizadas
      let customCategorias = [];
      if (restaurante.customCategorias) {
        if (restaurante.customCategorias instanceof Map) {
          customCategorias = Array.from(restaurante.customCategorias.keys());
        } else if (typeof restaurante.customCategorias === "object") {
          customCategorias = Object.keys(restaurante.customCategorias);
        }
      }

      // Combinar categorías
      const validCategorias = [...defaultCategorias, ...customCategorias];

      if (!validCategorias.includes(value)) {
        throw new Error("Categoría no válida");
      }

      return true;
    }),

  body("precio")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("imagen")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La imagen no puede exceder 500 caracteres"),

  body("disponible")
    .optional()
    .isBoolean()
    .withMessage("Disponible debe ser un valor booleano"),

  body("destacado")
    .optional()
    .isBoolean()
    .withMessage("Destacado debe ser un valor booleano"),

  body("tiempoPreparacion")
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      "El tiempo de preparación debe ser un número entero mayor o igual a 0"
    ),

  body("tags").optional().isArray().withMessage("Tags debe ser un array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Cada tag no puede exceder 50 caracteres"),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("Activo debe ser un valor booleano"),

  handleValidationErrors,
];

// Validaciones para cambiar disponibilidad de producto
export const validateToggleDisponibilidad = [
  body("disponible")
    .notEmpty()
    .withMessage("El campo disponible es requerido")
    .isBoolean()
    .withMessage("Disponible debe ser un valor booleano"),

  handleValidationErrors,
];

// ========== VALIDACIONES PARA PEDIDOS ==========

// Validaciones para crear pedido
export const validateCreatePedido = [
  body("mesaId")
    .notEmpty()
    .withMessage("La mesa es requerida")
    .isMongoId()
    .withMessage("ID de mesa inválido"),

  body("items")
    .notEmpty()
    .withMessage("Los items son requeridos")
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un producto en el pedido"),

  body("items.*.productoId")
    .notEmpty()
    .withMessage("El ID del producto es requerido")
    .isMongoId()
    .withMessage("ID de producto inválido"),

  body("items.*.cantidad")
    .notEmpty()
    .withMessage("La cantidad es requerida")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("items.*.notas")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Las notas no pueden exceder 200 caracteres"),

  body("nombreCliente")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre del cliente debe tener entre 2 y 100 caracteres"),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  body("propina")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La propina debe ser un número mayor o igual a 0"),

  handleValidationErrors,
];

// Validaciones para actualizar pedido
export const validateUpdatePedido = [
  body("items")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Debe haber al menos un producto en el pedido"),

  body("items.*.productoId")
    .optional()
    .isMongoId()
    .withMessage("ID de producto inválido"),

  body("items.*.cantidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero mayor a 0"),

  body("items.*.notas")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Las notas no pueden exceder 200 caracteres"),

  body("nombreCliente")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre del cliente debe tener entre 2 y 100 caracteres"),

  body("notas")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Las notas no pueden exceder 500 caracteres"),

  body("propina")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("La propina debe ser un número mayor o igual a 0"),

  handleValidationErrors,
];

// Validaciones para cambiar estado de pedido
export const validateChangeEstadoPedido = [
  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn(["pendiente", "en_preparacion", "listo", "entregado", "cancelado"])
    .withMessage("Estado no válido"),

  handleValidationErrors,
];

// Validaciones para restaurante
export const validateUpdateNombre = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  handleValidationErrors,
];

export const validateUpdateHorarios = [
  body("horarios")
    .notEmpty()
    .withMessage("Los horarios son requeridos")
    .isObject()
    .withMessage("Los horarios deben ser un objeto"),

  body("horarios.lunes")
    .optional()
    .isObject()
    .withMessage("El horario de lunes debe ser un objeto"),
  body("horarios.lunes.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.lunes.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.lunes.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.martes")
    .optional()
    .isObject()
    .withMessage("El horario de martes debe ser un objeto"),
  body("horarios.martes.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.martes.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.martes.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.miercoles")
    .optional()
    .isObject()
    .withMessage("El horario de miércoles debe ser un objeto"),
  body("horarios.miercoles.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.miercoles.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.miercoles.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.jueves")
    .optional()
    .isObject()
    .withMessage("El horario de jueves debe ser un objeto"),
  body("horarios.jueves.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.jueves.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.jueves.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.viernes")
    .optional()
    .isObject()
    .withMessage("El horario de viernes debe ser un objeto"),
  body("horarios.viernes.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.viernes.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.viernes.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.sabado")
    .optional()
    .isObject()
    .withMessage("El horario de sábado debe ser un objeto"),
  body("horarios.sabado.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.sabado.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.sabado.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  body("horarios.domingo")
    .optional()
    .isObject()
    .withMessage("El horario de domingo debe ser un objeto"),
  body("horarios.domingo.cerrado")
    .optional()
    .isBoolean()
    .withMessage("cerrado debe ser booleano"),
  body("horarios.domingo.apertura")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de apertura inválido (HH:MM)"),
  body("horarios.domingo.cierre")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato de cierre inválido (HH:MM)"),

  handleValidationErrors,
];

export const validateUpdateContacto = [
  body("telefono")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El teléfono no puede estar vacío")
    .custom((value) => {
      const telefonoLimpio = value.replace(/[\s-()]/g, "");
      if (telefonoLimpio.length < 8 || !/^\+?\d+$/.test(telefonoLimpio)) {
        throw new Error("Formato de teléfono inválido");
      }
      return true;
    }),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Formato de email inválido")
    .normalizeEmail(),

  body("direccion")
    .optional()
    .isObject()
    .withMessage("La dirección debe ser un objeto"),

  body("direccion.calle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La calle es requerida")
    .isLength({ min: 3, max: 200 })
    .withMessage("La calle debe tener entre 3 y 200 caracteres"),

  body("direccion.ciudad")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La ciudad es requerida")
    .isLength({ min: 2, max: 100 })
    .withMessage("La ciudad debe tener entre 2 y 100 caracteres"),

  body("direccion.estado")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El estado es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El estado debe tener entre 2 y 100 caracteres"),

  body("direccion.codigoPostal")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("El código postal debe tener entre 3 y 20 caracteres"),

  body("direccion.pais")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El país es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El país debe tener entre 2 y 100 caracteres"),

  handleValidationErrors,
];

// Validaciones para perfil de usuario
export const validateUpdateProfile = [
  body("nombre")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras"),

  body("apellido")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras"),

  body("telefono")
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      const telefonoLimpio = value.replace(/[\s-()]/g, "");
      if (telefonoLimpio.length < 8 || !/^\+?\d+$/.test(telefonoLimpio)) {
        throw new Error("Formato de teléfono inválido");
      }
      return true;
    }),

  body("foto")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La URL de la foto es demasiado larga"),

  handleValidationErrors,
];

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),

  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La nueva contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("La confirmación de contraseña es requerida")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),

  handleValidationErrors,
];
