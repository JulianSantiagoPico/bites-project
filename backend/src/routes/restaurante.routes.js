import express from "express";
import {
  getRestaurante,
  updateRestaurante,
  completarConfiguracion,
  getConfiguracion,
  updateNombre,
  updateHorarios,
  updateContacto,
} from "../controllers/restaurante.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import {
  validateUpdateNombre,
  validateUpdateHorarios,
  validateUpdateContacto,
} from "../middlewares/validators.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas públicas (cualquier usuario autenticado)
router.get("/", getRestaurante);
router.get("/configuracion", getConfiguracion);

// Rutas de administrador
router.put("/", authorize(ROLES.ADMIN), updateRestaurante);
router.post(
  "/completar-configuracion",
  authorize(ROLES.ADMIN),
  completarConfiguracion
);
router.put(
  "/nombre",
  authorize(ROLES.ADMIN),
  validateUpdateNombre,
  updateNombre
);
router.put(
  "/horarios",
  authorize(ROLES.ADMIN),
  validateUpdateHorarios,
  updateHorarios
);
router.put(
  "/contacto",
  authorize(ROLES.ADMIN),
  validateUpdateContacto,
  updateContacto
);

export default router;
