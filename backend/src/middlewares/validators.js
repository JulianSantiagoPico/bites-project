import { body, validationResult } from "express-validator";

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
    .isIn(["mesero", "cocinero", "cajero", "host"])
    .withMessage("Rol inválido"),

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
    .isIn(["admin", "mesero", "cocinero", "cajero", "host"])
    .withMessage("Rol inválido"),

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
    .isIn(["Interior", "Terraza", "Bar", "VIP"])
    .withMessage("Ubicación no válida"),

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
    .isIn(["Interior", "Terraza", "Bar", "VIP"])
    .withMessage("Ubicación no válida"),

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
    .isIn(["ninguna", "cumpleaños", "aniversario", "cita", "negocio", "otro"])
    .withMessage("Ocasión no válida"),

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
    .isIn(["ninguna", "cumpleaños", "aniversario", "cita", "negocio", "otro"])
    .withMessage("Ocasión no válida"),

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
    .isIn(["Entradas", "Platos Fuertes", "Postres", "Bebidas", "Otros"])
    .withMessage("Categoría no válida"),

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
    .isIn(["Entradas", "Platos Fuertes", "Postres", "Bebidas", "Otros"])
    .withMessage("Categoría no válida"),

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
