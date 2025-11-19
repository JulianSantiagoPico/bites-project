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
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
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
  checkPermission(PERMISSIONS.RESERVAS.VIEW),
  getEstadisticas
);

// Rutas principales de reservas
router
  .route("/")
  .get(checkPermission(PERMISSIONS.RESERVAS.VIEW), getReservas)
  .post(
    checkPermission(PERMISSIONS.RESERVAS.CREATE),
    validateCreateReserva,
    createReserva
  );

// Ruta para cambiar estado
router.patch(
  "/:id/estado",
  checkPermission(PERMISSIONS.RESERVAS.UPDATE),
  validateChangeEstadoReserva,
  changeEstado
);

// Ruta para asignar mesa
router.patch(
  "/:id/asignar-mesa",
  checkPermission(PERMISSIONS.RESERVAS.UPDATE),
  validateAsignarMesaReserva,
  asignarMesa
);

// Rutas por ID
router
  .route("/:id")
  .get(checkPermission(PERMISSIONS.RESERVAS.VIEW), getReservaById)
  .put(
    checkPermission(PERMISSIONS.RESERVAS.UPDATE),
    validateUpdateReserva,
    updateReserva
  )
  .delete(checkPermission(PERMISSIONS.RESERVAS.DELETE), deleteReserva);

export default router;
