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
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
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
  .post(
    checkPermission(PERMISSIONS.PRODUCTOS.CREATE),
    validateCreateProducto,
    createProducto
  );

// Ruta para cambiar disponibilidad - Requiere permiso de actualizar productos
router.patch(
  "/:id/disponibilidad",
  checkPermission(PERMISSIONS.PRODUCTOS.UPDATE),
  validateToggleDisponibilidad,
  toggleDisponibilidad
);

// Rutas por ID
router
  .route("/:id")
  .get(getProductoById) // Cualquier usuario autenticado puede ver un producto
  .put(
    checkPermission(PERMISSIONS.PRODUCTOS.UPDATE),
    validateUpdateProducto,
    updateProducto
  )
  .delete(checkPermission(PERMISSIONS.PRODUCTOS.DELETE), deleteProducto);

export default router;
