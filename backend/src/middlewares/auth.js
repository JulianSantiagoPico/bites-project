import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para verificar JWT y autenticar usuario
export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token existe en los headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No autorizado - Token no proporcionado",
      });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autorizado - Usuario no encontrado",
        });
      }

      if (!req.user.activo) {
        return res.status(401).json({
          success: false,
          message: "Usuario desactivado",
        });
      }

      next();
    } catch {
      // Token inválido o expirado
      return res.status(401).json({
        success: false,
        message: "No autorizado - Token inválido",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error en la autenticación",
      error: error.message,
    });
  }
};

// Middleware para verificar roles específicos
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.user.rol}' no tiene permiso para acceder a este recurso`,
      });
    }

    next();
  };
};

// Middleware para verificar permisos específicos
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "No autorizado",
        });
      }

      const { hasPermission } = await import("../config/roles.js");

      if (!hasPermission(req.user.rol, permission)) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para realizar esta acción",
          requiredPermission: permission,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al verificar permisos",
        error: error.message,
      });
    }
  };
};

// Middleware para verificar que el usuario pertenece al mismo restaurante
export const checkSameRestaurant = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // Este middleware asume que la petición tiene un parámetro o campo restauranteId
    const targetRestauranteId =
      req.params.restauranteId || req.body.restauranteId;

    if (!targetRestauranteId) {
      return next(); // Si no hay restauranteId en la petición, continuar
    }

    if (req.user.restauranteId.toString() !== targetRestauranteId.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "No tienes permiso para acceder a recursos de otro restaurante",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al verificar restaurante",
      error: error.message,
    });
  }
};
