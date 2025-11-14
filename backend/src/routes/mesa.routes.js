import express from "express";
import {
  getMesas,
  getMesaById,
  createMesa,
  updateMesa,
  deleteMesa,
  changeEstado,
  asignarMesero,
  getEstadisticas,
  getMesasDisponibles,
} from "../controllers/mesa.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  validateCreateMesa,
  validateUpdateMesa,
  validateChangeEstado,
  validateAsignarMesero,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de estadísticas y mesas disponibles (deben ir antes de /:id)
router.get("/estadisticas", getEstadisticas);
router.get("/disponibles", getMesasDisponibles);

// Rutas principales de mesas
router
  .route("/")
  .get(getMesas) // Cualquier usuario autenticado puede ver las mesas
  .post(authorize(ROLES.ADMIN), validateCreateMesa, createMesa); // Solo admin puede crear

// Ruta para cambiar estado - Admin, Mesero y Host
router.patch(
  "/:id/estado",
  authorize(ROLES.ADMIN, ROLES.MESERO, ROLES.HOST),
  validateChangeEstado,
  changeEstado
);

// Ruta para asignar mesero - Admin y Host
router.patch(
  "/:id/asignar",
  authorize(ROLES.ADMIN, ROLES.HOST),
  validateAsignarMesero,
  asignarMesero
);

// Rutas por ID
router
  .route("/:id")
  .get(getMesaById) // Cualquier usuario autenticado puede ver una mesa
  .put(authorize(ROLES.ADMIN), validateUpdateMesa, updateMesa) // Solo admin puede actualizar
  .delete(authorize(ROLES.ADMIN), deleteMesa); // Solo admin puede eliminar

export default router;
