import express from "express";
import {
  getRestaurante,
  updateRestaurante,
  completarConfiguracion,
} from "../controllers/restaurante.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas
router.get("/", getRestaurante);
router.put("/", updateRestaurante);
router.post("/completar-configuracion", completarConfiguracion);

export default router;
