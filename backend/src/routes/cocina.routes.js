import express from "express";
import {
  getPedidosCocina,
  comenzarPreparacion,
  terminarPreparacion,
  getEstadisticasCocina,
} from "../controllers/cocina.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Todas las rutas son para Admin y Cocinero
router.use(authorize(ROLES.ADMIN, ROLES.COCINERO));

// Rutas de estadísticas
router.get("/estadisticas", getEstadisticasCocina);

// Rutas de pedidos
router.get("/pedidos", getPedidosCocina);
router.patch("/pedidos/:id/comenzar", comenzarPreparacion);
router.patch("/pedidos/:id/terminar", terminarPreparacion);

export default router;
