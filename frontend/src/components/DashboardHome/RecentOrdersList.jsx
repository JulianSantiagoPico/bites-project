import { useMemo } from "react";
import { Clock, DollarSign, ClipboardList } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Componente que muestra las órdenes recientes del día
 * Con información de mesa, items, total, estado y tiempo
 */
const RecentOrdersList = ({ orders, loading }) => {
  // Función para obtener el color según el estado
  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: {
        bg: "rgba(53, 82, 74, 0.2)",
        text: "#35524a",
        label: "Nuevo",
      },
      en_preparacion: {
        bg: "rgba(230, 175, 46, 0.2)",
        text: "#e6af2e",
        label: "Preparando",
      },
      listo: {
        bg: "rgba(16, 185, 129, 0.2)",
        text: "#10B981",
        label: "Listo",
      },
      entregado: {
        bg: "rgba(88, 24, 69, 0.2)",
        text: "#581845",
        label: "Entregado",
      },
      cancelado: {
        bg: "rgba(239, 68, 68, 0.2)",
        text: "#ef4444",
        label: "Cancelado",
      },
    };
    return colores[estado] || colores.pendiente;
  };

  // Función para formatear el tiempo transcurrido
  const formatTiempo = (fecha) => {
    try {
      return formatDistanceToNow(new Date(fecha), {
        addSuffix: true,
        locale: es,
      });
    } catch (error) {
      return "Recién";
    }
  };

  // Preparar las órdenes para mostrar
  const ordersToDisplay = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    return orders.slice(0, 4);
  }, [orders]);

  if (loading) {
    return (
      <div className="lg:col-span-2 rounded-xl shadow-md bg-white">
        <div className="p-6 border-b border-secondary/20">
          <h3 className="text-xl font-bold text-primary">Órdenes Recientes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-background animate-pulse"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="lg:col-span-2 rounded-xl shadow-md bg-white">
        <div className="p-6 border-b border-secondary/20">
          <h3 className="text-xl font-bold text-primary">Órdenes Recientes</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-textSecondary" />
            <p className="text-textSecondary">No hay órdenes recientes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 rounded-xl shadow-md bg-white">
      <div className="p-6 border-b border-secondary/20">
        <h3 className="text-xl font-bold text-primary">Órdenes Recientes</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {ordersToDisplay.map((order) => {
            const estadoColor = getEstadoColor(order.estado);

            return (
              <div
                key={order._id || order.id}
                className="flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-shadow bg-background"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-primary">
                      {order.numeroPedido || `ORD-${order.id}`}
                    </p>
                    <p className="text-sm text-textSecondary">
                      {order.mesaId?.numero
                        ? `Mesa ${order.mesaId.numero}`
                        : "Sin mesa"}{" "}
                      • {order.items?.length || 0} items
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-textSecondary">
                      <Clock className="w-3 h-3" />
                      <span>{formatTiempo(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <p className="font-bold text-primary">
                      {order.total?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: estadoColor.bg,
                      color: estadoColor.text,
                    }}
                  >
                    {estadoColor.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentOrdersList;
