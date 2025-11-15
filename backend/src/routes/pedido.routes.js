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
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
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
    authorize(ROLES.ADMIN, ROLES.MESERO),
    validateCreatePedido,
    createPedido
  ); // Admin y Mesero pueden crear

// Ruta para cambiar estado - Admin, Mesero, Cocinero, Cajero
router.patch(
  "/:id/estado",
  authorize(ROLES.ADMIN, ROLES.MESERO, ROLES.COCINERO, ROLES.CAJERO),
  validateChangeEstadoPedido,
  changeEstado
);

// Rutas por ID
router
  .route("/:id")
  .get(getPedidoById) // Todos los usuarios autenticados pueden ver un pedido
  .put(authorize(ROLES.ADMIN, ROLES.MESERO), validateUpdatePedido, updatePedido) // Admin y Mesero pueden actualizar
  .delete(authorize(ROLES.ADMIN, ROLES.MESERO), cancelPedido); // Admin y Mesero pueden cancelar

export default router;
