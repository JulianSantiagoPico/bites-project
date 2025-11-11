import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import { validateRegister, validateLogin } from "../middlewares/validators.js";

const router = express.Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Rutas protegidas
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
