/**
 * @deprecated Este archivo mantiene la retrocompatibilidad.
 * Se recomienda importar desde los archivos específicos o desde './services/index.js'
 *
 * Ejemplos de importación:
 * - import { authService } from './services/auth.service'
 * - import { authService, empleadosService } from './services'
 */

// Re-exportar todos los servicios desde sus archivos individuales
export {
  authService,
  restauranteService,
  empleadosService,
  inventarioService,
  mesasService,
  reservasService,
  productosService,
  fetchAPI,
  API_URL,
} from "./index";

// Export default para mantener compatibilidad
export { fetchAPI as default } from "./config";
