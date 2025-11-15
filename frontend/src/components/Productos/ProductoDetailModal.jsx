import {
  getCategoryIcon,
  getDisponibilidadColor,
  getStatusColor,
  formatPrice,
  formatTiempoPreparacion,
  formatDateTime,
  getTagColor,
} from "../../utils/productosUtils";

/**
 * Modal para ver detalles completos de un producto
 * Vista de solo lectura con toda la información
 */
const ProductoDetailModal = ({ isOpen, onClose, producto }) => {
  if (!isOpen || !producto) return null;

  const disponibilidadColor = getDisponibilidadColor(producto.disponible);
  const statusColor = getStatusColor(producto.activo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-scale-in bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b bg-white border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="text-4xl w-14 h-14 rounded-full flex items-center justify-center bg-background">
              {producto.imagen || getCategoryIcon(producto.categoria)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {producto.nombre}
              </h2>
              <p className="text-sm text-textSecondary">{producto.categoria}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-textSecondary"
            aria-label="Cerrar modal"
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

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Descripción */}
          {producto.descripcion && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-primary">
                Descripción
              </h3>
              <p className="text-textMain">{producto.descripcion}</p>
            </div>
          )}

          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm font-medium mb-1 text-textSecondary">
                Precio
              </p>
              <p className="text-2xl font-bold text-accent">
                {formatPrice(producto.precio)}
              </p>
            </div>

            {/* Tiempo de Preparación */}
            <div className="p-4 rounded-lg bg-background">
              <p className="text-sm font-medium mb-1 text-textSecondary">
                Tiempo de Preparación
              </p>
              <p className="text-xl font-bold text-primary">
                {formatTiempoPreparacion(producto.tiempoPreparacion)}
              </p>
            </div>
          </div>

          {/* Estados y Badges */}
          <div className="space-y-3">
            {/* Disponibilidad */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm font-medium text-textMain">
                Disponibilidad
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${disponibilidadColor.bg} ${disponibilidadColor.text}`}
              >
                {disponibilidadColor.label}
              </span>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm font-medium text-textMain">Estado</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
              >
                {statusColor.label}
              </span>
            </div>

            {/* Destacado */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background">
              <span className="text-sm font-medium text-textMain">
                Producto Destacado
              </span>
              <span className="text-xl">
                {producto.destacado ? "⭐ Sí" : "No"}
              </span>
            </div>
          </div>

          {/* Tags */}
          {producto.tags && producto.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-primary">
                Tags / Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {producto.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(
                      tag
                    )}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Información de Auditoría */}
          <div className="pt-6 mt-6 border-t space-y-2 border-secondary/20">
            <h3 className="text-sm font-semibold mb-3 text-primary">
              Información del Sistema
            </h3>

            <div className="flex items-center justify-between text-sm">
              <span className="text-textSecondary">ID del Producto</span>
              <span className="font-mono text-xs text-textMain">
                {producto.id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-textSecondary">Fecha de Creación</span>
              <span className="text-textMain">
                {formatDateTime(producto.createdAt)}
              </span>
            </div>

            {producto.updatedAt &&
              producto.updatedAt !== producto.createdAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-textSecondary">
                    Última Actualización
                  </span>
                  <span className="text-textMain">
                    {formatDateTime(producto.updatedAt)}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t bg-white border-secondary/20">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetailModal;
