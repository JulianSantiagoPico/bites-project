import User from "../models/User.js";
import { ROLES } from "../config/roles.js";

/**
 * @desc    Obtener todos los empleados del restaurante
 * @route   GET /api/users
 * @access  Private (Admin)
 */
export const getUsers = async (req, res) => {
  try {
    const { rol, activo } = req.query;

    // Construir filtro
    const filter = {
      restauranteId: req.user.restauranteId,
    };

    // Filtrar por rol si se proporciona
    if (rol) {
      filter.rol = rol;
    }

    // Filtrar por estado activo si se proporciona
    if (activo !== undefined) {
      filter.activo = activo === "true";
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: {
        users: users.map((user) => user.toPublicJSON()),
      },
    });
  } catch (error) {
    console.error("Error en getUsers:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener un empleado por ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en getUserById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};

/**
 * @desc    Crear nuevo empleado
 * @route   POST /api/users
 * @access  Private (Admin)
 */
export const createUser = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol, telefono } = req.body;

    // Verificar que no se intente crear un admin
    if (rol === ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "No se puede crear un usuario con rol de administrador",
      });
    }

    // Verificar si el email ya existe en este restaurante
    const userExists = await User.findOne({
      email,
      restauranteId: req.user.restauranteId,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un empleado con este email en tu restaurante",
      });
    }

    // Crear el empleado
    const user = await User.create({
      nombre,
      apellido,
      email,
      password,
      rol,
      telefono,
      restauranteId: req.user.restauranteId,
      creadoPor: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Empleado creado exitosamente",
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en createUser:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear empleado",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar empleado
 * @route   PUT /api/users/:id
 * @access  Private (Admin)
 */
export const updateUser = async (req, res) => {
  try {
    const { nombre, apellido, telefono, rol, activo } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // No permitir cambiar el rol del admin principal
    if (user.rol === ROLES.ADMIN && rol && rol !== ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "No se puede cambiar el rol del administrador",
      });
    }

    // No permitir cambiar a rol admin
    if (rol === ROLES.ADMIN && user.rol !== ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "No se puede asignar el rol de administrador",
      });
    }

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (telefono !== undefined) user.telefono = telefono;
    if (rol) user.rol = rol;
    if (activo !== undefined) user.activo = activo;

    await user.save();

    res.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateUser:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar empleado (soft delete)
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      restauranteId: req.user.restauranteId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // No permitir eliminar al admin principal
    if (user.rol === ROLES.ADMIN) {
      return res.status(400).json({
        success: false,
        message: "No se puede eliminar al administrador",
      });
    }

    // Soft delete - solo desactivar
    user.activo = false;
    await user.save();

    res.json({
      success: true,
      message: "Usuario desactivado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteUser:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};
