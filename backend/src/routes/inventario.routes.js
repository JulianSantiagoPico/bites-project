import express from "express";
import {
  getInventario,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  adjustStock,
  getEstadisticas,
  getAlertas,
} from "../controllers/inventario.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  validateCreateInventario,
  validateUpdateInventario,
  validateStockAdjustment,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas y alertas (deben ir antes de /:id)
router.get("/estadisticas", getEstadisticas);
router.get("/alertas", getAlertas);

// Rutas principales del inventario
router
  .route("/")
  .get(getInventario) // Cualquier usuario autenticado puede ver el inventario
  .post(authorize(ROLES.ADMIN), validateCreateInventario, createItem); // Solo admin puede crear

// Ruta para ajustar stock - Admin y Cocinero
router.post(
  "/:id/ajustar",
  authorize(ROLES.ADMIN, ROLES.COCINERO),
  validateStockAdjustment,
  adjustStock
);

// Rutas por ID
router
  .route("/:id")
  .get(getItemById) // Cualquier usuario autenticado puede ver un item
  .put(authorize(ROLES.ADMIN), validateUpdateInventario, updateItem) // Solo admin puede actualizar
  .delete(authorize(ROLES.ADMIN), deleteItem); // Solo admin puede eliminar

export default router;
