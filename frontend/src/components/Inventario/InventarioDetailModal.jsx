import {
  getCategoryIcon,
  getStatusColor,
  formatPrice,
  formatDate,
  getExpirationAlert,
} from "../../utils/inventarioUtils";

/**
 * Modal para ver detalles completos de un item del inventario
 */
const InventarioDetailModal = ({
  isOpen,
  item,
  onClose,
  onEdit,
  onDelete,
  onReactivate,
  onAdjustStock,
}) => {
  if (!isOpen || !item) return null;

  const statusColor = getStatusColor(item.estado);
  const expirationAlert = getExpirationAlert(item.fechaVencimiento);

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
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl w-20 h-20 rounded-full flex items-center justify-center bg-background">
              {getCategoryIcon(item.categoria)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary">{item.nombre}</h3>
              <p className="text-textSecondary">{item.categoria}</p>
            </div>
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

        {/* Alerta de vencimiento */}
        {expirationAlert && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              expirationAlert.type === "danger"
                ? "bg-red-50 border border-red-200"
                : expirationAlert.type === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{expirationAlert.icon}</span>
              <div>
                <p
                  className={`font-semibold ${
                    expirationAlert.type === "danger"
                      ? "text-red-800"
                      : expirationAlert.type === "warning"
                      ? "text-yellow-800"
                      : "text-blue-800"
                  }`}
                >
                  {expirationAlert.message}
                </p>
                <p className="text-sm text-textSecondary">
                  Fecha de vencimiento: {formatDate(item.fechaVencimiento)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información principal */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Stock */}
          <div className="p-4 rounded-lg bg-background">
            <p className="text-sm text-textSecondary mb-1">Stock Actual</p>
            <p className="text-3xl font-bold text-primary">
              {item.cantidad} {item.unidadMedida}
            </p>
          </div>

          {/* Estado */}
          <div className="p-4 rounded-lg bg-background">
            <p className="text-sm text-textSecondary mb-1">Estado</p>
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
            >
              {item.estado}
            </span>
          </div>

          {/* Precio Unitario */}
          <div className="p-4 rounded-lg bg-background">
            <p className="text-sm text-textSecondary mb-1">Precio Unitario</p>
            <p className="text-2xl font-bold text-accent">
              {formatPrice(item.precioUnitario)}
            </p>
          </div>

          {/* Valor Total */}
          <div className="p-4 rounded-lg bg-background">
            <p className="text-sm text-textSecondary mb-1">Valor Total</p>
            <p className="text-2xl font-bold text-accent">
              {formatPrice(item.valorTotal)}
            </p>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">
                Stock Mínimo
              </p>
              <p className="text-textMain">
                {item.cantidadMinima} {item.unidadMedida}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">
                Unidad de Medida
              </p>
              <p className="text-textMain">{item.unidadMedida}</p>
            </div>
          </div>

          {item.proveedor && (
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">
                Proveedor
              </p>
              <p className="text-textMain">{item.proveedor}</p>
            </div>
          )}

          {item.lote && (
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">Lote</p>
              <p className="text-textMain">{item.lote}</p>
            </div>
          )}

          {item.descripcion && (
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">
                Descripción
              </p>
              <p className="text-textMain">{item.descripcion}</p>
            </div>
          )}

          {item.fechaVencimiento && (
            <div>
              <p className="text-sm font-medium text-textSecondary mb-1">
                Fecha de Vencimiento
              </p>
              <p className="text-textMain">{formatDate(item.fechaVencimiento)}</p>
            </div>
          )}
        </div>

        {/* Información de auditoría */}
        <div className="pt-6 border-t border-secondary/20">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-textSecondary mb-1">Fecha de Creación</p>
              <p className="text-textMain">{formatDate(item.createdAt)}</p>
            </div>
            <div>
              <p className="text-textSecondary mb-1">Última Actualización</p>
              <p className="text-textMain">{formatDate(item.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-secondary/20">
          {item.activo ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  onAdjustStock(item);
                }}
                className="flex-1 px-4 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-green-500 flex items-center justify-center gap-2"
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
                Ajustar Stock
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                className="flex-1 px-4 py-3 rounded-lg font-medium border-2 hover:bg-blue-50 transition-colors border-blue-500 text-blue-500"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete(item);
                }}
                className="px-4 py-3 rounded-lg font-medium border-2 hover:bg-red-50 transition-colors border-red-500 text-red-500"
              >
                Desactivar
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onClose();
                onReactivate(item);
              }}
              className="flex-1 px-4 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-green-500"
            >
              Reactivar Item
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg font-medium border-2 hover:bg-gray-50 transition-colors border-secondary text-textMain"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventarioDetailModal;
