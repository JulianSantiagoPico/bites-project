import express from "express";
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  toggleDisponibilidad,
  getEstadisticas,
  getProductosDestacados,
} from "../controllers/producto.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  validateCreateProducto,
  validateUpdateProducto,
  validateToggleDisponibilidad,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas y destacados (deben ir antes de /:id)
router.get("/estadisticas", getEstadisticas);
router.get("/destacados", getProductosDestacados);

// Rutas principales de productos
router
  .route("/")
  .get(getProductos) // Cualquier usuario autenticado puede ver productos
  .post(authorize(ROLES.ADMIN), validateCreateProducto, createProducto); // Solo admin puede crear

// Ruta para cambiar disponibilidad - Admin y Cocinero
router.patch(
  "/:id/disponibilidad",
  authorize(ROLES.ADMIN, ROLES.COCINERO),
  validateToggleDisponibilidad,
  toggleDisponibilidad
);

// Rutas por ID
router
  .route("/:id")
  .get(getProductoById) // Cualquier usuario autenticado puede ver un producto
  .put(authorize(ROLES.ADMIN), validateUpdateProducto, updateProducto) // Solo admin puede actualizar
  .delete(authorize(ROLES.ADMIN), deleteProducto); // Solo admin puede eliminar

export default router;
