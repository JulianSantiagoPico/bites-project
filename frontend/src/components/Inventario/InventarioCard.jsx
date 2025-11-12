import {
  getCategoryIcon,
  getStatusColor,
  formatPrice,
  calculateStockPercentage,
  getExpirationAlert,
} from "../../utils/inventarioUtils";

/**
 * Componente de tarjeta individual para mostrar información de un item del inventario
 * Incluye: Icono, nombre, categoría, cantidad, precio, estado y acciones
 */
const InventarioCard = ({
  item,
  onViewDetail,
  onEdit,
  onDelete,
  onReactivate,
  onAdjustStock,
}) => {
  const statusColor = getStatusColor(item.estado);
  const stockPercentage = calculateStockPercentage(
    item.cantidad,
    item.cantidadMinima
  );
  const expirationAlert = getExpirationAlert(item.fechaVencimiento);

  return (
    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      {/* Header con icono y nombre */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-4xl w-16 h-16 rounded-full flex items-center justify-center bg-background">
            {getCategoryIcon(item.categoria)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-primary truncate">{item.nombre}</h3>
            <p className="text-sm text-textSecondary">{item.categoria}</p>
          </div>
        </div>
      </div>

      {/* Información del item */}
      <div className="space-y-3">
        {/* Cantidad con barra de progreso */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-textSecondary">Stock</span>
            <span className="text-sm font-semibold text-primary">
              {item.cantidad} {item.unidadMedida}
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-background">
            <div
              className="h-full transition-all duration-300"
              style={{
                backgroundColor: statusColor.hex,
                width: `${Math.min(stockPercentage, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-textSecondary mt-1">
            Mínimo: {item.cantidadMinima} {item.unidadMedida}
          </p>
        </div>

        {/* Precio */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Precio Unitario</span>
          <span className="text-sm font-semibold text-accent">
            {formatPrice(item.precioUnitario)}
          </span>
        </div>

        {/* Valor Total */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Valor Total</span>
          <span className="text-sm font-bold text-accent">
            {formatPrice(item.valorTotal)}
          </span>
        </div>

        {/* Estado */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-textSecondary">Estado</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {item.estado}
          </span>
        </div>

        {/* Proveedor */}
        {item.proveedor && (
          <div className="pt-3 mt-3 border-t border-secondary/20">
            <p className="text-xs text-textSecondary">
              📦 Proveedor: {item.proveedor}
            </p>
          </div>
        )}

        {/* Alerta de vencimiento */}
        {expirationAlert && (
          <div
            className={`p-2 rounded-lg text-xs font-medium ${
              expirationAlert.type === "danger"
                ? "bg-red-50 text-red-600"
                : expirationAlert.type === "warning"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {expirationAlert.icon} {expirationAlert.message}
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        {/* Ver detalle */}
        <button
          onClick={() => onViewDetail(item)}
          className="flex-1 py-2 rounded-lg font-medium border-2 hover:bg-blue-50 transition-colors text-sm border-secondary/40 text-primary"
        >
          Ver Detalle
        </button>

        {item.activo && (
          <>
            {/* Ajustar stock */}
            <button
              onClick={() => onAdjustStock(item)}
              className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-500"
              title="Ajustar Stock"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>

            {/* Editar */}
            <button
              onClick={() => onEdit(item)}
              className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#3B82F6]"
              title="Editar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Desactivar */}
            <button
              onClick={() => onDelete(item)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
              title="Desactivar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </button>
          </>
        )}

        {/* Reactivar (solo si está inactivo) */}
        {!item.activo && (
          <button
            onClick={() => onReactivate(item)}
            className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-500"
            title="Reactivar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default InventarioCard;
