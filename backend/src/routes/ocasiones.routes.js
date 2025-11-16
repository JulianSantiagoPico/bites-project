import express from "express";
import {
  getOcasiones,
  updateOcasiones,
} from "../controllers/ocasiones.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Aplicar protect a todas las rutas
router.use(protect);

/**
 * @route   GET /api/ocasiones
 * @desc    Obtener ocasiones del restaurante
 * @access  Private
 */
router.get("/", getOcasiones);

/**
 * @route   PUT /api/ocasiones
 * @desc    Actualizar ocasiones personalizadas
 * @access  Private (Admin)
 */
router.put("/", authorize(ROLES.ADMIN), updateOcasiones);

export default router;
