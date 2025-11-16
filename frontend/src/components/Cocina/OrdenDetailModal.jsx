import { X, Clock, Users, User, Calendar, UtensilsCrossed } from "lucide-react";

/**
 * Formatear precio
 */
const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Formatear fecha y hora
 */
const formatDateTime = (date) => {
  return new Date(date).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Modal de detalle de orden
 */
const OrdenDetailModal = ({ orden, onClose }) => {
  if (!orden) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-primary text-white p-6 flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{orden.numeroPedido}</h2>
              <p className="text-white/80">Detalle de la Orden</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Información general */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Users className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-textSecondary">Mesa</p>
                  <p className="font-semibold text-textMain">
                    Mesa {orden.mesaId?.numero || "N/A"}
                  </p>
                  {orden.mesaId?.ubicacion && (
                    <p className="text-sm text-textSecondary">
                      {orden.mesaId.ubicacion}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <User className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-textSecondary">Mesero</p>
                  <p className="font-semibold text-textMain">
                    {orden.meseroId?.nombre} {orden.meseroId?.apellido}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Calendar className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-textSecondary">Fecha y Hora</p>
                  <p className="font-semibold text-textMain">
                    {formatDateTime(orden.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Clock className="w-5 h-5 text-accent mt-1" />
                <div>
                  <p className="text-sm text-textSecondary">Tiempo de Espera</p>
                  <p className="font-semibold text-textMain">
                    {orden.tiempoEspera || 0} minutos
                  </p>
                </div>
              </div>
            </div>

            {/* Cliente */}
            {orden.nombreCliente && (
              <div className="mb-6 p-4 rounded-lg border-2 border-accent/30 bg-accent/5">
                <p className="text-sm text-textSecondary mb-1">Cliente</p>
                <p className="font-semibold text-textMain text-lg">
                  {orden.nombreCliente}
                </p>
              </div>
            )}

            {/* Items del pedido */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">
                  Productos ({orden.items?.length || 0})
                </h3>
              </div>

              <div className="space-y-3">
                {orden.items?.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
                    style={{ borderColor: "#E5E7EB" }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-textMain text-lg">
                          {item.cantidad}x {item.nombre}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {formatPrice(item.precioUnitario)} c/u
                        </p>
                      </div>
                      <p className="font-bold text-primary text-lg">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>

                    {item.notas && (
                      <div className="mt-2 p-2 rounded bg-yellow-50 border-l-4 border-accent">
                        <p className="text-sm text-textMain">
                          <span className="font-semibold">Nota: </span>
                          {item.notas}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notas generales */}
            {orden.notas && (
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <p className="text-sm text-textSecondary mb-1 font-semibold">
                  Notas Generales
                </p>
                <p className="text-textMain">{orden.notas}</p>
              </div>
            )}

            {/* Totales */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-textMain">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {formatPrice(orden.subtotal)}
                </span>
              </div>

              {orden.impuestos > 0 && (
                <div className="flex justify-between text-textMain">
                  <span>Impuestos:</span>
                  <span className="font-semibold">
                    {formatPrice(orden.impuestos)}
                  </span>
                </div>
              )}

              {orden.propina > 0 && (
                <div className="flex justify-between text-textMain">
                  <span>Propina:</span>
                  <span className="font-semibold">
                    {formatPrice(orden.propina)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t-2 border-gray-300">
                <span>Total:</span>
                <span>{formatPrice(orden.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="p-4 bg-gray-50 border-t flex justify-end"
            style={{ borderColor: "#E5E7EB" }}
          >
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdenDetailModal;
