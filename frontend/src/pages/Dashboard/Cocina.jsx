import { useState } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  ChefHat,
  AlertTriangle,
  XCircle,
  UtensilsCrossed,
} from "lucide-react";
import CocinaStats from "../../components/Cocina/CocinaStats";
import CocinaFilters from "../../components/Cocina/CocinaFilters";
import OrdenCard from "../../components/Cocina/OrdenCard";
import OrdenDetailModal from "../../components/Cocina/OrdenDetailModal";
import Notification from "../../components/Notification";
import { useCocina } from "../../hooks/useCocina";

const Cocina = () => {
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    ordenes,
    stats,
    loading,
    error,
    filterEstado,
    notification,
    connected,
    setFilterEstado,
    comenzarPreparacion,
    terminarPreparacion,
    loadOrdenes,
    closeNotification,
  } = useCocina();

  const handleViewDetail = (orden) => {
    setSelectedOrden(orden);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrden(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <ChefHat size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Cocina</h2>
            <p className="text-textSecondary">
              Gestión de órdenes en tiempo real
            </p>
          </div>
        </div>

        {/* Status de conexión */}
        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Conectado
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                Desconectado
              </span>
            </div>
          )}

          <button
            onClick={loadOrdenes}
            disabled={loading}
            className="p-2 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            title="Recargar órdenes"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <CocinaStats stats={stats} />

      {/* Alerts */}
      {stats.tiempoEsperaMasLargo > 30 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3 bg-white shadow-md border-l-4"
          style={{
            borderColor: "#a4161a",
          }}
        >
          <AlertTriangle
            className="w-6 h-6 shrink-0 mt-0.5"
            style={{ color: "#a4161a" }}
          />
          <div>
            <p className="font-semibold" style={{ color: "#a4161a" }}>
              ¡Atención!
            </p>
            <p className="text-sm text-textMain">
              Hay pedidos con más de {stats.tiempoEsperaMasLargo} minutos de
              espera. Prioriza las órdenes urgentes.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <CocinaFilters
        filterEstado={filterEstado}
        onFilterChange={setFilterEstado}
      />

      {/* Órdenes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando órdenes...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
            <button
              onClick={loadOrdenes}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : ordenes.length === 0 ? (
        <div
          className="text-center py-16 bg-white rounded-xl shadow-md border"
          style={{ borderColor: "#E5E7EB" }}
        >
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-medium text-textMain mb-2">
            No hay órdenes{" "}
            {filterEstado !== "Todos" ? `en estado "${filterEstado}"` : ""}
          </p>
          <p className="text-textSecondary">
            Las nuevas órdenes aparecerán aquí automáticamente
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {ordenes.map((orden) => (
            <OrdenCard
              key={orden._id}
              orden={orden}
              onComenzar={comenzarPreparacion}
              onTerminar={terminarPreparacion}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <OrdenDetailModal
          orden={selectedOrden}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default Cocina;
