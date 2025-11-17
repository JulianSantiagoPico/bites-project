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

/**
 * @desc    Obtener configuración del restaurante
 * @route   GET /api/restaurante/configuracion
 * @access  Private
 */
export const getConfiguracion = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(
      req.user.restauranteId
    ).select(
      "nombre descripcion telefono email direccion horarios moneda logo"
    );

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
    console.error("Error al obtener configuración:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la configuración del restaurante",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar nombre del restaurante
 * @route   PUT /api/restaurante/nombre
 * @access  Private (Admin)
 */
export const updateNombre = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "El nombre es requerido",
      });
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    restaurante.nombre = nombre.trim();
    await restaurante.save();

    res.json({
      success: true,
      message: "Nombre actualizado exitosamente",
      data: {
        nombre: restaurante.nombre,
      },
    });
  } catch (error) {
    console.error("Error al actualizar nombre:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el nombre del restaurante",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar horarios del restaurante
 * @route   PUT /api/restaurante/horarios
 * @access  Private (Admin)
 */
export const updateHorarios = async (req, res) => {
  try {
    const { horarios } = req.body;

    if (!horarios) {
      return res.status(400).json({
        success: false,
        message: "Los horarios son requeridos",
      });
    }

    // Validar estructura de horarios
    const diasValidos = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    const horariosInvalidos = Object.keys(horarios).filter(
      (dia) => !diasValidos.includes(dia)
    );

    if (horariosInvalidos.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Días inválidos: ${horariosInvalidos.join(", ")}`,
      });
    }

    // Validar formato de horarios
    for (const [dia, horario] of Object.entries(horarios)) {
      if (horario.cerrado === false) {
        if (!horario.apertura || !horario.cierre) {
          return res.status(400).json({
            success: false,
            message: `El ${dia} debe tener horarios de apertura y cierre`,
          });
        }

        // Validar formato HH:MM
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (
          !timeRegex.test(horario.apertura) ||
          !timeRegex.test(horario.cierre)
        ) {
          return res.status(400).json({
            success: false,
            message: `Formato de hora inválido para ${dia}. Use HH:MM`,
          });
        }
      }
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    restaurante.horarios = horarios;
    await restaurante.save();

    res.json({
      success: true,
      message: "Horarios actualizados exitosamente",
      data: {
        horarios: restaurante.horarios,
      },
    });
  } catch (error) {
    console.error("Error al actualizar horarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar los horarios",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar información de contacto del restaurante
 * @route   PUT /api/restaurante/contacto
 * @access  Private (Admin)
 */
export const updateContacto = async (req, res) => {
  try {
    const { telefono, email, direccion } = req.body;

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Formato de email inválido",
        });
      }
    }

    // Validar teléfono si se proporciona
    if (telefono) {
      const telefonoLimpio = telefono.replace(/[\s-()]/g, "");
      if (telefonoLimpio.length < 8 || !/^\+?\d+$/.test(telefonoLimpio)) {
        return res.status(400).json({
          success: false,
          message: "Formato de teléfono inválido",
        });
      }
    }

    // Validar dirección si se proporciona
    if (direccion) {
      const camposRequeridos = ["calle", "ciudad", "estado", "pais"];
      const camposFaltantes = camposRequeridos.filter(
        (campo) => !direccion[campo] || direccion[campo].trim() === ""
      );

      if (camposFaltantes.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Campos requeridos en la dirección: ${camposFaltantes.join(
            ", "
          )}`,
        });
      }
    }

    const restaurante = await Restaurante.findById(req.user.restauranteId);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante no encontrado",
      });
    }

    // Actualizar solo los campos proporcionados
    if (telefono !== undefined) restaurante.telefono = telefono;
    if (email !== undefined) restaurante.email = email;
    if (direccion !== undefined) restaurante.direccion = direccion;

    await restaurante.save();

    res.json({
      success: true,
      message: "Información de contacto actualizada exitosamente",
      data: {
        telefono: restaurante.telefono,
        email: restaurante.email,
        direccion: restaurante.direccion,
      },
    });
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la información de contacto",
      error: error.message,
    });
  }
};

export default {
  getRestaurante,
  updateRestaurante,
  completarConfiguracion,
  getConfiguracion,
  updateNombre,
  updateHorarios,
  updateContacto,
};
