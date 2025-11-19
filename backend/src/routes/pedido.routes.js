import express from "express";
import {
  getPedidos,
  getPedidoById,
  getPedidosByMesa,
  createPedido,
  updatePedido,
  changeEstado,
  cancelPedido,
  getEstadisticas,
} from "../controllers/pedido.controller.js";
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
import {
  validateCreatePedido,
  validateUpdatePedido,
  validateChangeEstadoPedido,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas (debe ir antes de /:id)
router.get("/estadisticas", getEstadisticas);

// Ruta para obtener pedidos por mesa
router.get("/mesa/:mesaId", getPedidosByMesa);

// Rutas principales de pedidos
router
  .route("/")
  .get(getPedidos) // Todos los usuarios autenticados pueden ver pedidos
  .post(
    checkPermission(PERMISSIONS.TOMAR_PEDIDO.CREATE),
    validateCreatePedido,
    createPedido
  );

// Ruta para cambiar estado - Requiere permiso de tomar pedido
router.patch(
  "/:id/estado",
  checkPermission(PERMISSIONS.TOMAR_PEDIDO.CREATE),
  validateChangeEstadoPedido,
  changeEstado
);

// Rutas por ID
router
  .route("/:id")
  .get(getPedidoById)
  .put(
    checkPermission(PERMISSIONS.TOMAR_PEDIDO.CREATE),
    validateUpdatePedido,
    updatePedido
  )
  .delete(checkPermission(PERMISSIONS.TOMAR_PEDIDO.CREATE), cancelPedido);

export default router;
