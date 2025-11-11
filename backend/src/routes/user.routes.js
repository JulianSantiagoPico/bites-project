import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";
import {
  validateCreateEmployee,
  validateUpdateUser,
} from "../middlewares/validators.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas para empleados - Solo admin puede crear, actualizar y eliminar
router
  .route("/")
  .get(getUsers) // Cualquier usuario autenticado puede ver la lista
  .post(authorize(ROLES.ADMIN), validateCreateEmployee, createUser);

router
  .route("/:id")
  .get(getUserById)
  .put(authorize(ROLES.ADMIN), validateUpdateUser, updateUser)
  .delete(authorize(ROLES.ADMIN), deleteUser);

export default router;
