import express from "express";
import {
  getRoles,
  getTodosRoles,
  updateRoles,
  getRolePermissions,
  getAllPermissions,
  updateRolePermissions,
} from "../controllers/roles.controller.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Aplicar protect a todas las rutas
router.use(protect);

/**
 * @route   GET /api/roles
 * @desc    Obtener roles activos del restaurante
 * @access  Private (Admin)
 */
router.get("/", authorize(ROLES.ADMIN), getRoles);

/**
 * @route   GET /api/roles/todos
 * @desc    Obtener todos los roles (activos e inactivos)
 * @access  Private (Admin)
 */
router.get("/todos", authorize(ROLES.ADMIN), getTodosRoles);

/**
 * @route   PUT /api/roles
 * @desc    Actualizar roles personalizados
 * @access  Private (Admin)
 */
router.put("/", authorize(ROLES.ADMIN), updateRoles);

/**
 * @route   GET /api/roles/permissions
 * @desc    Obtener todos los permisos disponibles
 * @access  Private (Admin)
 */
router.get("/permissions", authorize(ROLES.ADMIN), getAllPermissions);

/**
 * @route   PUT /api/roles/permissions/:roleName
 * @desc    Actualizar permisos de un rol específico
 * @access  Private (Admin)
 */
router.put(
  "/permissions/:roleName",
  authorize(ROLES.ADMIN),
  updateRolePermissions
);

/**
 * @route   GET /api/roles/:roleName/permissions
 * @desc    Obtener permisos de un rol específico
 * @access  Private
 */
router.get("/:roleName/permissions", getRolePermissions);

export default router;
