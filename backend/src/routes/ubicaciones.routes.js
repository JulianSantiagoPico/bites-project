import express from "express";
import {
  getUbicaciones,
  updateUbicaciones,
} from "../controllers/ubicaciones.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Aplicar protect a todas las rutas
router.use(protect);

/**
 * @route   GET /api/ubicaciones
 * @desc    Obtener ubicaciones del restaurante
 * @access  Private
 */
router.get("/", getUbicaciones);

/**
 * @route   PUT /api/ubicaciones
 * @desc    Actualizar ubicaciones personalizadas
 * @access  Private (Admin)
 */
router.put("/", authorize(ROLES.ADMIN), updateUbicaciones);

export default router;
