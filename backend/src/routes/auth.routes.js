import express from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  getUserStats,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} from "../middlewares/validators.js";

const router = express.Router();

// Rutas públicas
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Rutas protegidas
router.get("/me", protect, getMe);
router.put("/me", protect, validateUpdateProfile, updateMe);
router.put("/me/password", protect, validateChangePassword, changePassword);
router.get("/me/stats", protect, getUserStats);

export default router;
