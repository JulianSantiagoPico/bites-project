import { useEffect } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useSocket } from "../../context/SocketContext";
import DashboardStats from "../../components/DashboardHome/DashboardStats";
import RecentOrdersList from "../../components/DashboardHome/RecentOrdersList";
import TopProductsWidget from "../../components/DashboardHome/TopProductsWidget";
import QuickActions from "../../components/DashboardHome/QuickActions";
import Notification from "../../components/Notification";
import { RefreshCw } from "lucide-react";

const DashboardHome = () => {
  const {
    loading,
    error,
    notification,
    stats,
    recentOrders,
    topProducts,
    refreshDashboard,
    clearNotification,
  } = useDashboard();

  const { socket } = useSocket();

  // Actualizar dashboard en tiempo real cuando hay cambios en pedidos
  useEffect(() => {
    if (!socket) return;

    const handlePedidoUpdate = () => {
      console.log("Pedido actualizado - Refrescando dashboard");
      refreshDashboard();
    };

    // Escuchar eventos de pedidos
    socket.on("nuevoPedido", handlePedidoUpdate);
    socket.on("pedidoActualizado", handlePedidoUpdate);
    socket.on("estadoCambiado", handlePedidoUpdate);

    return () => {
      socket.off("nuevoPedido", handlePedidoUpdate);
      socket.off("pedidoActualizado", handlePedidoUpdate);
      socket.off("estadoCambiado", handlePedidoUpdate);
    };
  }, [socket, refreshDashboard]);

  // Manejo de errores
  if (error && !loading) {
    return (
      <div className="space-y-6">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={clearNotification}
          />
        )}
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg font-medium text-error mb-4">{error}</p>
            <button
              onClick={refreshDashboard}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}

      {/* Botón de refresco */}
      <div className="flex justify-end">
        <button
          onClick={refreshDashboard}
          disabled={loading}
          className="px-4 py-2 rounded-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refrescar datos"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refrescar</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <RecentOrdersList orders={recentOrders} loading={loading} />

        {/* Top Products */}
        <TopProductsWidget products={topProducts} loading={loading} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default DashboardHome;
