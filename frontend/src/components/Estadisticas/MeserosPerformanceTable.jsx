import { Trophy, TrendingUp, DollarSign, Package } from "lucide-react";
import { formatCurrency } from "../../utils/chartConfig";

/**
 * Componente de tabla de performance de meseros
 */
const MeserosPerformanceTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Performance de Meseros
        </h3>
        <div className="h-64 flex items-center justify-center text-textSecondary">
          No hay datos de meseros para mostrar
        </div>
      </div>
    );
  }

  // Top 5 meseros
  const topMeseros = data.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={24} className="text-accent" />
        <h3 className="text-lg font-semibold text-primary">
          Top Meseros - Performance
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary/20">
              <th className="text-left py-3 px-2 text-sm font-semibold text-primary">
                #
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-primary">
                Mesero
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-primary">
                <div className="flex items-center justify-center gap-1">
                  <DollarSign size={16} />
                  Ventas
                </div>
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-primary">
                <div className="flex items-center justify-center gap-1">
                  <Package size={16} />
                  Pedidos
                </div>
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-primary">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp size={16} />
                  Ticket Prom.
                </div>
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-primary">
                Propinas
              </th>
            </tr>
          </thead>
          <tbody>
            {topMeseros.map((mesero, index) => (
              <tr
                key={mesero.meseroId}
                className="border-b border-gray-100 hover:bg-background transition-colors"
              >
                {/* Posición */}
                <td className="py-4 px-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-accent text-white"
                        : index === 1
                        ? "bg-gray-300 text-gray-700"
                        : index === 2
                        ? "bg-orange-300 text-orange-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>

                {/* Nombre */}
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-textMain">{mesero.nombre}</p>
                    <p className="text-sm text-textSecondary">
                      {mesero.pedidosCompletados} completados de{" "}
                      {mesero.pedidosTotales} totales
                    </p>
                  </div>
                </td>

                {/* Ventas */}
                <td className="py-4 px-4 text-center">
                  <p className="font-bold text-primary">
                    {formatCurrency(mesero.ventasTotal)}
                  </p>
                </td>

                {/* Pedidos */}
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-secondary">
                    {mesero.pedidosCompletados}
                  </p>
                </td>

                {/* Ticket Promedio */}
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-accent">
                    {formatCurrency(mesero.ticketPromedio)}
                  </p>
                </td>

                {/* Propinas */}
                <td className="py-4 px-4 text-center">
                  <p className="font-semibold text-success">
                    {formatCurrency(mesero.propinasTotal)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas generales */}
      {data.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-textSecondary text-center">
          Mostrando top 5 de {data.length} meseros
        </div>
      )}
    </div>
  );
};

export default MeserosPerformanceTable;
