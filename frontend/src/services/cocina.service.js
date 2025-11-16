import { fetchAPI } from "./config";

/**
 * Obtener pedidos de cocina
 */
export const getPedidosCocina = async (estado = null) => {
  const endpoint = estado
    ? `/cocina/pedidos?estado=${estado}`
    : "/cocina/pedidos";
  return fetchAPI(endpoint);
};

/**
 * Obtener estadísticas de cocina
 */
export const getEstadisticasCocina = async () => {
  return fetchAPI("/cocina/estadisticas");
};

/**
 * Comenzar preparación de un pedido
 */
export const comenzarPreparacion = async (pedidoId) => {
  return fetchAPI(`/cocina/pedidos/${pedidoId}/comenzar`, {
    method: "PATCH",
  });
};

/**
 * Terminar preparación de un pedido (marcar como listo)
 */
export const terminarPreparacion = async (pedidoId) => {
  return fetchAPI(`/cocina/pedidos/${pedidoId}/terminar`, {
    method: "PATCH",
  });
};

const cocinaService = {
  getPedidosCocina,
  getEstadisticasCocina,
  comenzarPreparacion,
  terminarPreparacion,
};

export default cocinaService;
