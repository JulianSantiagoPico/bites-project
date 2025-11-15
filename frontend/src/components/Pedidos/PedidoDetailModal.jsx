import {
  formatPrice,
  formatDateTime,
  getEstadoBadgeColor,
  getTimeElapsed,
  getAvailableEstados,
} from "../../utils/pedidosUtils";

/**
 * Modal para mostrar detalles completos de un pedido
 */
const PedidoDetailModal = ({ isOpen, pedido, onClose, onChangeEstado }) => {
  if (!isOpen || !pedido) return null;

  const estadoInfo = getEstadoBadgeColor(pedido.estado);
  const timeElapsed = getTimeElapsed(pedido.createdAt);
  const availableEstados = getAvailableEstados(pedido.estado);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              Pedido {pedido.numeroPedido}
            </h3>
            <p className="text-sm text-textSecondary">{timeElapsed}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Estado */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${estadoInfo.bg} ${estadoInfo.text}`}
          >
            <span className="text-xl mr-2">{estadoInfo.icon}</span>
            {estadoInfo.label}
          </span>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-textSecondary">Mesa</p>
              <p className="text-lg font-semibold text-textMain">
                Mesa {pedido.mesaId?.numero || "N/A"}
              </p>
            </div>
            {pedido.nombreCliente && (
              <div>
                <p className="text-sm text-textSecondary">Cliente</p>
                <p className="text-lg font-semibold text-textMain">
                  {pedido.nombreCliente}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-textSecondary">Mesero</p>
              <p className="text-lg font-semibold text-textMain">
                {pedido.meseroId?.nombre || "N/A"}{" "}
                {pedido.meseroId?.apellido || ""}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-textSecondary">Fecha de creación</p>
              <p className="text-lg font-semibold text-textMain">
                {formatDateTime(pedido.createdAt)}
              </p>
            </div>
            {pedido.fechaEntrega && (
              <div>
                <p className="text-sm text-textSecondary">Fecha de entrega</p>
                <p className="text-lg font-semibold text-textMain">
                  {formatDateTime(pedido.fechaEntrega)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Items del pedido */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-textMain mb-4">
            Items del Pedido
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            {pedido.items?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-semibold text-textMain">
                    {item.cantidad}x {item.nombre}
                  </p>
                  {item.notas && (
                    <p className="text-sm text-textSecondary mt-1">
                      Nota: {item.notas}
                    </p>
                  )}
                  <p className="text-sm text-textSecondary mt-1">
                    {formatPrice(item.precioUnitario)} c/u
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-textMain">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notas del pedido */}
        {pedido.notas && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-textMain mb-2">
              Notas del Pedido
            </h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-textMain">{pedido.notas}</p>
            </div>
          </div>
        )}

        {/* Totales */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-textMain">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatPrice(pedido.subtotal)}
              </span>
            </div>
            {pedido.impuestos > 0 && (
              <div className="flex justify-between text-textMain">
                <span>Impuestos</span>
                <span className="font-semibold">
                  {formatPrice(pedido.impuestos)}
                </span>
              </div>
            )}
            {pedido.propina > 0 && (
              <div className="flex justify-between text-textMain">
                <span>Propina</span>
                <span className="font-semibold">
                  {formatPrice(pedido.propina)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-gray-300">
              <span>Total</span>
              <span>{formatPrice(pedido.total)}</span>
            </div>
          </div>
        </div>

        {/* Historial de estados */}
        {pedido.historialEstados && pedido.historialEstados.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-textMain mb-3">
              Historial de Estados
            </h4>
            <div className="space-y-2">
              {pedido.historialEstados.map((historial, index) => {
                const estadoHistorialInfo = getEstadoBadgeColor(
                  historial.estado
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3"
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoHistorialInfo.bg} ${estadoHistorialInfo.text}`}
                    >
                      {estadoHistorialInfo.label}
                    </span>
                    <span className="text-textSecondary">
                      {formatDateTime(historial.fechaCambio)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acciones */}
        {availableEstados.length > 0 && (
          <div className="flex gap-3">
            {availableEstados.map((estado) => (
              <button
                key={estado.value}
                onClick={() => {
                  onChangeEstado(pedido.id, estado.value, pedido);
                  onClose();
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-colors ${
                  estado.value === "cancelado"
                    ? "bg-error hover:bg-red-700"
                    : estado.value === "entregado"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : estado.value === "listo"
                    ? "bg-success hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {estado.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoDetailModal;
