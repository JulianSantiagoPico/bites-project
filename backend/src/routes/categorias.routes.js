import express from "express";
import {
  getCategorias,
  updateCategorias,
} from "../controllers/categorias.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Aplicar protect a todas las rutas
router.use(protect);

/**
 * @route   GET /api/categorias
 * @desc    Obtener categorías del restaurante
 * @access  Private
 */
router.get("/", getCategorias);

/**
 * @route   PUT /api/categorias
 * @desc    Actualizar categorías personalizadas
 * @access  Private (Admin)
 */
router.put("/", authorize(ROLES.ADMIN), updateCategorias);

export default router;
