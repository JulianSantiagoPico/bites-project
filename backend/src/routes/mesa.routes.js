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
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
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
  .post(
    checkPermission(PERMISSIONS.MESAS.CREATE),
    validateCreateMesa,
    createMesa
  );

// Ruta para cambiar estado - Requiere permiso de actualizar mesas
router.patch(
  "/:id/estado",
  checkPermission(PERMISSIONS.MESAS.UPDATE),
  validateChangeEstado,
  changeEstado
);

// Ruta para asignar mesero - Requiere permiso de actualizar mesas
router.patch(
  "/:id/asignar",
  checkPermission(PERMISSIONS.MESAS.UPDATE),
  validateAsignarMesero,
  asignarMesero
);

// Rutas por ID
router
  .route("/:id")
  .get(getMesaById) // Cualquier usuario autenticado puede ver una mesa
  .put(
    checkPermission(PERMISSIONS.MESAS.UPDATE),
    validateUpdateMesa,
    updateMesa
  )
  .delete(checkPermission(PERMISSIONS.MESAS.DELETE), deleteMesa);

export default router;
