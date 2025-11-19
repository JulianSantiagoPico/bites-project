import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";
import {
  validateCreateEmployee,
  validateUpdateUser,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para empleados - Verificar permisos específicos
router
  .route("/")
  .get(getUsers) // Cualquier usuario autenticado puede ver la lista
  .post(
    checkPermission(PERMISSIONS.EMPLEADOS.CREATE),
    validateCreateEmployee,
    createUser
  );

router
  .route("/:id")
  .get(getUserById)
  .put(
    checkPermission(PERMISSIONS.EMPLEADOS.UPDATE),
    validateUpdateUser,
    updateUser
  )
  .delete(checkPermission(PERMISSIONS.EMPLEADOS.DELETE), deleteUser);

export default router;
