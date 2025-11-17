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
import { protect, authorize } from "../middlewares/auth.js";
import { ROLES } from "../config/roles.js";

const router = express.Router();

// Todas las rutas requieren autenticación y solo ADMIN puede acceder
router.use(protect);
router.use(authorize(ROLES.ADMIN));

/**
 * @route   GET /api/estadisticas/generales
 * @desc    Obtener estadísticas generales del dashboard
 * @access  Private (Admin)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get("/generales", getEstadisticasGenerales);

/**
 * @route   GET /api/estadisticas/ventas
 * @desc    Obtener estadísticas detalladas de ventas
 * @access  Private (Admin)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 * @query   fechaInicio: fecha personalizada (YYYY-MM-DD)
 * @query   fechaFin: fecha personalizada (YYYY-MM-DD)
 */
router.get("/ventas", getEstadisticasVentas);

/**
 * @route   GET /api/estadisticas/productos
 * @desc    Obtener estadísticas de productos más vendidos
 * @access  Private (Admin)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 * @query   limit: cantidad de productos a retornar (default: 10)
 */
router.get("/productos", getEstadisticasProductos);

/**
 * @route   GET /api/estadisticas/mesas
 * @desc    Obtener estadísticas de ocupación de mesas
 * @access  Private (Admin)
 * @query   fecha: fecha específica (YYYY-MM-DD) - default: hoy
 */
router.get("/mesas", getEstadisticasMesas);

/**
 * @route   GET /api/estadisticas/empleados
 * @desc    Obtener estadísticas de performance de meseros
 * @access  Private (Admin)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get("/empleados", getEstadisticasEmpleados);

/**
 * @route   GET /api/estadisticas/inventario
 * @desc    Obtener estadísticas de inventario y alertas de stock
 * @access  Private (Admin)
 */
router.get("/inventario", getEstadisticasInventario);

/**
 * @route   GET /api/estadisticas/reservas
 * @desc    Obtener estadísticas de reservas
 * @access  Private (Admin)
 * @query   periodo: hoy, ayer, semana, mes, trimestre, año
 */
router.get("/reservas", getEstadisticasReservas);

export default router;
