import express from "express";
import {
  getReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva,
  changeEstado,
  asignarMesa,
  getEstadisticas,
} from "../controllers/reserva.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  validateCreateReserva,
  validateUpdateReserva,
  validateChangeEstadoReserva,
  validateAsignarMesaReserva,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas (deben ir antes de /:id)
router.get(
  "/estadisticas",
  authorize(ROLES.ADMIN, ROLES.HOST),
  getEstadisticas
);

// Rutas principales de reservas - Solo Admin y Host
router
  .route("/")
  .get(authorize(ROLES.ADMIN, ROLES.HOST), getReservas)
  .post(
    authorize(ROLES.ADMIN, ROLES.HOST),
    validateCreateReserva,
    createReserva
  );

// Ruta para cambiar estado - Admin y Host
router.patch(
  "/:id/estado",
  authorize(ROLES.ADMIN, ROLES.HOST),
  validateChangeEstadoReserva,
  changeEstado
);

// Ruta para asignar mesa - Admin y Host
router.patch(
  "/:id/asignar-mesa",
  authorize(ROLES.ADMIN, ROLES.HOST),
  validateAsignarMesaReserva,
  asignarMesa
);

// Rutas por ID
router
  .route("/:id")
  .get(authorize(ROLES.ADMIN, ROLES.HOST), getReservaById)
  .put(authorize(ROLES.ADMIN, ROLES.HOST), validateUpdateReserva, updateReserva)
  .delete(authorize(ROLES.ADMIN, ROLES.HOST), deleteReserva);

export default router;
