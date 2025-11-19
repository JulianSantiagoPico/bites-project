import express from "express";
import {
  getEstadisticasGenerales,
  getEstadisticasVentas,
  getEstadisticasProductos,
  getEstadisticasMesas,
  getEstadisticasEmpleados,
  getEstadisticasInventario,
  getEstadisticasReservas,
} from "../controllers/estadisticas.controller.js";
import { protect, checkPermission } from "../middlewares/auth.js";
import { PERMISSIONS } from "../config/roles.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

/**
 * @route   GET /api/estadisticas/generales
 * @desc    Obtener estadísticas generales del dashboard (accesible para todos)
 * @access  Private (Todos los roles autenticados)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get("/generales", getEstadisticasGenerales);

/**
 * @route   GET /api/estadisticas/productos
 * @desc    Obtener estadísticas de productos más vendidos (accesible para todos)
 * @access  Private (Todos los roles autenticados)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 * @query   limit: cantidad de productos a retornar (default: 10)
 */
router.get("/productos", getEstadisticasProductos);

/**
 * @route   GET /api/estadisticas/ventas
 * @desc    Obtener estadísticas detalladas de ventas
 * @access  Private (Requiere permiso de estadísticas)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 * @query   fechaInicio: fecha personalizada (YYYY-MM-DD)
 * @query   fechaFin: fecha personalizada (YYYY-MM-DD)
 */
router.get(
  "/ventas",
  checkPermission(PERMISSIONS.ESTADISTICAS.VIEW),
  getEstadisticasVentas
);

/**
 * @route   GET /api/estadisticas/mesas
 * @desc    Obtener estadísticas de ocupación de mesas
 * @access  Private (Requiere permiso de estadísticas)
 * @query   fecha: fecha específica (YYYY-MM-DD) - default: hoy
 */
router.get(
  "/mesas",
  checkPermission(PERMISSIONS.ESTADISTICAS.VIEW),
  getEstadisticasMesas
);

/**
 * @route   GET /api/estadisticas/empleados
 * @desc    Obtener estadísticas de performance de meseros
 * @access  Private (Requiere permiso de estadísticas)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get(
  "/empleados",
  checkPermission(PERMISSIONS.ESTADISTICAS.VIEW),
  getEstadisticasEmpleados
);

/**
 * @route   GET /api/estadisticas/inventario
 * @desc    Obtener estadísticas de inventario y alertas de stock
 * @access  Private (Requiere permiso de estadísticas)
 */
router.get(
  "/inventario",
  checkPermission(PERMISSIONS.ESTADISTICAS.VIEW),
  getEstadisticasInventario
);

/**
 * @route   GET /api/estadisticas/reservas
 * @desc    Obtener estadísticas de reservas
 * @access  Private (Requiere permiso de estadísticas)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get(
  "/reservas",
  checkPermission(PERMISSIONS.ESTADISTICAS.VIEW),
  getEstadisticasReservas
);

export default router;
