import express from "express";
import {
  getPedidosCocina,
  comenzarPreparacion,
  terminarPreparacion,
  getEstadisticasCocina,
} from "../controllers/cocina.controller.js";
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

/**
 * @route   GET /api/cocina/estadisticas
 * @desc    Obtener estadísticas de cocina
 * @access  Private (cocina:view)
 */
router.get(
  "/estadisticas",
  checkPermission(PERMISSIONS.COCINA.VIEW),
  getEstadisticasCocina
);

/**
 * @route   GET /api/cocina/pedidos
 * @desc    Obtener pedidos para cocina
 * @access  Private (cocina:view)
 */
router.get(
  "/pedidos",
  checkPermission(PERMISSIONS.COCINA.VIEW),
  getPedidosCocina
);

/**
 * @route   PATCH /api/cocina/pedidos/:id/comenzar
 * @desc    Comenzar preparación de un pedido
 * @access  Private (cocina:update)
 */
router.patch(
  "/pedidos/:id/comenzar",
  checkPermission(PERMISSIONS.COCINA.UPDATE),
  comenzarPreparacion
);

/**
 * @route   PATCH /api/cocina/pedidos/:id/terminar
 * @desc    Terminar preparación de un pedido
 * @access  Private (cocina:update)
 */
router.patch(
  "/pedidos/:id/terminar",
  checkPermission(PERMISSIONS.COCINA.UPDATE),
  terminarPreparacion
);

export default router;
