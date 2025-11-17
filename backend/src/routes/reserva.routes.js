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
  authorize(ROLES.ADMIN, ROLES.GERENTE),
  getEstadisticas
);

// Rutas principales de reservas - Solo Admin y Gerente
router
  .route("/")
  .get(authorize(ROLES.ADMIN, ROLES.GERENTE), getReservas)
  .post(
    authorize(ROLES.ADMIN, ROLES.GERENTE),
    validateCreateReserva,
    createReserva
  );

// Ruta para cambiar estado - Admin y Gerente
router.patch(
  "/:id/estado",
  authorize(ROLES.ADMIN, ROLES.GERENTE),
  validateChangeEstadoReserva,
  changeEstado
);

// Ruta para asignar mesa - Admin y Gerente
router.patch(
  "/:id/asignar-mesa",
  authorize(ROLES.ADMIN, ROLES.GERENTE),
  validateAsignarMesaReserva,
  asignarMesa
);

// Rutas por ID
router
  .route("/:id")
  .get(authorize(ROLES.ADMIN, ROLES.GERENTE), getReservaById)
  .put(
    authorize(ROLES.ADMIN, ROLES.GERENTE),
    validateUpdateReserva,
    updateReserva
  )
  .delete(authorize(ROLES.ADMIN, ROLES.GERENTE), deleteReserva);

export default router;
