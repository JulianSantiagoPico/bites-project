import {
  getCategoryIcon,
  getStatusColor,
  formatPrice,
  calculateStockPercentage,
  getExpirationAlert,
} from "../../utils/inventarioUtils";

/**
 * Componente de tabla para mostrar el inventario
 * Muestra todos los items en formato de tabla con acciones
 */
const InventarioTable = ({
  items,
  onViewDetail,
  onEdit,
  onDelete,
  onReactivate,
  onAdjustStock,
}) => {
  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Precio Unit.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Valor Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const statusColor = getStatusColor(item.estado);
              const stockPercentage = calculateStockPercentage(
                item.cantidad,
                item.cantidadMinima
              );
              const expirationAlert = getExpirationAlert(item.fechaVencimiento);

              return (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "white" : "#faf3e0",
                    borderBottom: `1px solid #35524a20`,
                  }}
                  className="hover:bg-backgroundSecondary/50 transition-colors"
                >
                  {/* Producto */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getCategoryIcon(item.categoria)}
                      </span>
                      <div>
                        <p className="font-semibold text-primary">
                          {item.nombre}
                        </p>
                        {expirationAlert && (
                          <p
                            className={`text-xs font-medium mt-1 ${
                              expirationAlert.type === "danger"
                                ? "text-red-600"
                                : expirationAlert.type === "warning"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          >
                            {expirationAlert.icon} {expirationAlert.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4 text-textMain text-sm">
                    {item.categoria}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-primary text-sm">
                        {item.cantidad} {item.unidadMedida}
                      </p>
                      <div className="w-24 h-2 rounded-full mt-1 overflow-hidden bg-background">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            backgroundColor: statusColor.hex,
                            width: `${Math.min(stockPercentage, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-textSecondary mt-1">
                        Mín: {item.cantidadMinima}
                      </p>
                    </div>
                  </td>

                  {/* Precio Unitario */}
                  <td className="px-6 py-4 font-semibold text-accent text-sm">
                    {formatPrice(item.precioUnitario)}
                  </td>

                  {/* Valor Total */}
                  <td className="px-6 py-4 font-bold text-accent text-sm">
                    {formatPrice(item.valorTotal)}
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium inline-block w-fit ${statusColor.bg} ${statusColor.text}`}
                      >
                        {item.estado}
                      </span>
                      {!item.activo && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium inline-block w-fit bg-gray-100 text-gray-600">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Ver detalle */}
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-500"
                        title="Ver Detalle"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventarioTable;
