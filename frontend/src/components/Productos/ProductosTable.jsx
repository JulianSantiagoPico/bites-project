import {
  getCategoryIcon,
  getDisponibilidadColor,
  getStatusColor,
  formatPrice,
  formatTiempoPreparacion,
  getTagColor,
} from "../../utils/productosUtils";

/**
 * Componente de tabla para mostrar productos
 * Muestra información detallada en formato tabla con acciones
 */
const ProductosTable = ({
  productos,
  onViewDetail,
  onEdit,
  onDelete,
  onReactivate,
  onToggleDisponibilidad,
}) => {
  if (productos.length === 0) {
    return (
      <div className="rounded-xl p-12 text-center shadow-md bg-white">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-lg font-medium text-textSecondary">
          No se encontraron productos
        </p>
        <p className="text-sm text-textSecondary mt-2">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl shadow-md overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Tiempo Prep.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Disponibilidad
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/20">
            {productos.map((producto) => {
              const disponibilidadColor = getDisponibilidadColor(
                producto.disponible
              );
              const statusColor = getStatusColor(producto.activo);

              return (
                <tr
                  key={producto.id}
                  className="hover:bg-background/50 transition-colors"
                >
                  {/* Producto */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl w-12 h-12 rounded-full flex items-center justify-center bg-background shrink-0">
                        {producto.imagen || getCategoryIcon(producto.categoria)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-primary truncate">
                            {producto.nombre}
                          </p>
                          {producto.destacado && (
                            <span className="text-accent text-sm">⭐</span>
                          )}
                        </div>
                        {producto.descripcion && (
                          <p className="text-sm text-textSecondary truncate max-w-xs">
                            {producto.descripcion}
                          </p>
                        )}
                        {producto.tags && producto.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {producto.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(
                                  tag
                                )}`}
                              >
                                {tag}
                              </span>
                            ))}
                            {producto.tags.length > 2 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                +{producto.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoría */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getCategoryIcon(producto.categoria)}
                      </span>
                      <span className="text-sm font-medium text-textMain">
                        {producto.categoria}
                      </span>
                    </div>
                  </td>

                  {/* Precio */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-accent">
                      {formatPrice(producto.precio)}
                    </span>
                  </td>

                  {/* Tiempo de Preparación */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-textMain">
                      {formatTiempoPreparacion(producto.tiempoPreparacion)}
                    </span>
                  </td>

                  {/* Disponibilidad */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${disponibilidadColor.bg} ${disponibilidadColor.text}`}
                    >
                      {disponibilidadColor.label}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
                    >
                      {statusColor.label}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Ver detalle */}
                      <button
                        onClick={() => onViewDetail(producto)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
                        title="Ver detalle"
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

                      {/* Editar */}
                      {producto.activo && (
                        <button
                          onClick={() => onEdit(producto)}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
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
                      )}

                      {/* Toggle Disponibilidad */}
                      {producto.activo && (
                        <button
                          onClick={() => onToggleDisponibilidad(producto)}
                          className={`p-2 rounded-lg transition-colors ${
                            producto.disponible
                              ? "hover:bg-red-50 text-red-600"
                              : "hover:bg-green-50 text-green-600"
                          }`}
                          title={
                            producto.disponible
                              ? "Marcar no disponible"
                              : "Marcar disponible"
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {producto.disponible ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </button>
                      )}

                      {/* Desactivar / Reactivar */}
                      {producto.activo ? (
                        <button
                          onClick={() => onDelete(producto)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => onReactivate(producto)}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-600"
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
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

export default ProductosTable;
