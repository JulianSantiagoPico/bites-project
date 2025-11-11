import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Restaurante from "../models/Restaurante.js";
import { ROLES } from "../config/roles.js";

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

/**
 * @desc    Registrar nuevo usuario (Admin de restaurante)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, restaurante } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    // Crear el restaurante primero (sin adminId todavía)
    const nuevoRestaurante = await Restaurante.create({
      nombre: restaurante.nombre,
      descripcion: restaurante.descripcion || "",
      telefono: restaurante.telefono || "",
      email: restaurante.email || email,
      adminId: null, // Lo actualizaremos después
    });

    // Crear el usuario admin con rol de administrador
    const user = await User.create({
      nombre,
      apellido,
      email,
      password,
      rol: ROLES.ADMIN,
      restauranteId: nuevoRestaurante._id,
    });

    // Actualizar el restaurante con el ID del admin
    nuevoRestaurante.adminId = user._id;
    await nuevoRestaurante.save();

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: user.toPublicJSON(),
        restaurante: {
          id: nuevoRestaurante._id,
          nombre: nuevoRestaurante.nombre,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

/**
 * @desc    Login de usuario
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email (incluir password)
    const user = await User.findOne({ email })
      .select("+password")
      .populate("restauranteId", "nombre");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario desactivado. Contacte al administrador",
      });
    }

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    // Generar token
    const token = generateToken(user._id);

    // Remover password antes de enviar
    const userResponse = user.toPublicJSON();

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          ...userResponse,
          restaurante: {
            id: user.restauranteId._id,
            nombre: user.restauranteId.nombre,
          },
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener perfil del usuario actual
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "restauranteId",
      "nombre email telefono direccion"
    );

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
        restaurante: user.restauranteId,
      },
    });
  } catch (error) {
    console.error("Error en getMe:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar perfil del usuario actual
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateMe = async (req, res) => {
  try {
    const { nombre, apellido, telefono, foto } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar campos permitidos
    if (nombre) user.nombre = nombre;
    if (apellido) user.apellido = apellido;
    if (telefono) user.telefono = telefono;
    if (foto !== undefined) user.foto = foto;

    await user.save();

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: {
        user: user.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Error en updateMe:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};
