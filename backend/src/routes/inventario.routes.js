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
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
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
  .post(
    checkPermission(PERMISSIONS.INVENTARIO.CREATE),
    validateCreateInventario,
    createItem
  );

// Ruta para ajustar stock - Requiere permiso de actualizar inventario
router.post(
  "/:id/ajustar",
  checkPermission(PERMISSIONS.INVENTARIO.UPDATE),
  validateStockAdjustment,
  adjustStock
);

// Rutas por ID
router
  .route("/:id")
  .get(getItemById) // Cualquier usuario autenticado puede ver un item
  .put(
    checkPermission(PERMISSIONS.INVENTARIO.UPDATE),
    validateUpdateInventario,
    updateItem
  )
  .delete(checkPermission(PERMISSIONS.INVENTARIO.DELETE), deleteItem);

export default router;
