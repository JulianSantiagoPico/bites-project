import express from "express";
import {
  getUbicaciones,
  getTodasUbicaciones,
  updateUbicaciones,
} from "../controllers/ubicaciones.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Aplicar protect a todas las rutas
router.use(protect);

/**
 * @route   GET /api/ubicaciones
 * @desc    Obtener ubicaciones activas del restaurante
 * @access  Private
 */
router.get("/", getUbicaciones);

/**
 * @route   GET /api/ubicaciones/todas
 * @desc    Obtener todas las ubicaciones (activas e inactivas)
 * @access  Private (Admin)
 */
router.get("/todas", authorize(ROLES.ADMIN), getTodasUbicaciones);

/**
 * @route   PUT /api/ubicaciones
 * @desc    Actualizar ubicaciones personalizadas
 * @access  Private (Admin)
 */
router.put("/", authorize(ROLES.ADMIN), updateUbicaciones);

export default router;
