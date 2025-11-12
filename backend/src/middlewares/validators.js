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
