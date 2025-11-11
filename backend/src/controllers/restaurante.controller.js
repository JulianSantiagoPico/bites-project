import Restaurante from "../models/Restaurante.js";
import User from "../models/User.js";

/**
 * @desc    Obtener información del restaurante
 * @route   GET /api/restaurante
 * @access  Private
 */
export const getRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    res.json({
      success: true,
      data: restaurante,
    });
  } catch (error) {
    console.error("Error al obtener restaurante:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener información del restaurante",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar información del restaurante
 * @route   PUT /api/restaurante
 * @access  Private (Admin)
 */
export const updateRestaurante = async (req, res) => {
  try {
    const { descripcion, telefono, email, direccion, logo, moneda, horarios } =
      req.body;

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar campos
    if (descripcion !== undefined) restaurante.descripcion = descripcion;
    if (telefono !== undefined) restaurante.telefono = telefono;
    if (email !== undefined) restaurante.email = email;
    if (direccion !== undefined) restaurante.direccion = direccion;
    if (logo !== undefined) restaurante.logo = logo;
    if (moneda !== undefined) restaurante.moneda = moneda;
    if (horarios !== undefined) restaurante.horarios = horarios;

    await restaurante.save();

    // Si es la primera vez que completa la configuración, actualizar el usuario
    if (!req.user.configuracionCompleta) {
      await User.findByIdAndUpdate(req.user._id, {
        configuracionCompleta: true,
      });
    }

    res.json({
      success: true,
      message: "Restaurante actualizado exitosamente",
      data: restaurante,
    });
  } catch (error) {
    console.error("Error al actualizar restaurante:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el restaurante",
      error: error.message,
    });
  }
};

/**
 * @desc    Completar configuración inicial del restaurante
 * @route   POST /api/restaurante/completar-configuracion
 * @access  Private (Admin)
 */
export const completarConfiguracion = async (req, res) => {
  try {
    const { descripcion, telefono, email, direccion, moneda, horarios } =
      req.body;

    // Validar que el usuario sea admin
    if (req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Solo el administrador puede completar la configuración",
      });
    }

    // Buscar el restaurante
    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar información del restaurante
    restaurante.descripcion = descripcion;
    restaurante.telefono = telefono;
    if (email) restaurante.email = email;
    restaurante.direccion = direccion;
    restaurante.moneda = moneda;
    restaurante.horarios = horarios;

    await restaurante.save();

    // Marcar la configuración como completa en el usuario
    const usuario = await User.findByIdAndUpdate(
      req.user._id,
      { configuracionCompleta: true },
      { new: true }
    );

    res.json({
      success: true,
      message: "Configuración completada exitosamente",
      data: {
        restaurante,
        usuario: usuario.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error al completar configuración:", error);
    res.status(500).json({
      success: false,
      message: "Error al completar la configuración",
      error: error.message,
    });
  }
};

export default {
  getRestaurante,
  updateRestaurante,
  completarConfiguracion,
};
