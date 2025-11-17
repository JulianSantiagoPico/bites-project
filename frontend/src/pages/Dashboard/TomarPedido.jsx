import { useState } from "react";
import PedidosStats from "../../components/Pedidos/PedidosStats";
import PedidosFilters from "../../components/Pedidos/PedidosFilters";
import PedidoCard from "../../components/Pedidos/PedidoCard";
import PedidoModal from "../../components/Pedidos/PedidoModal";
import PedidoDetailModal from "../../components/Pedidos/PedidoDetailModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { usePedidos } from "../../hooks/usePedidos";
import { useMesas } from "../../hooks/useMesas";
import { sortByPriority } from "../../utils/pedidosUtils";
import { ClipboardList, Plus } from "lucide-react";
import "./TomarPedido.css";

const TomarPedido = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  // Hook personalizado con toda la lógica de pedidos
  const {
    loading,
    searchTerm,
    filterEstado,
    filterMesa,
    notification,
    confirmDialog,
    filteredPedidos,
    stats,
    setSearchTerm,
    setFilterEstado,
    setFilterMesa,
    createPedido,
    changeEstado,
    cancelPedido,
    closeNotification,
    closeConfirmDialog,
  } = usePedidos();

  // Hook para obtener mesas (para el filtro)
  const { mesas: allMesas, loading: loadingMesas } = useMesas();

  // Mesas disponibles para el filtro (solo activas)
  const mesasParaFiltro = allMesas.filter((mesa) => mesa.activo);

  // Ordenar pedidos por prioridad
  const sortedPedidos = sortByPriority(filteredPedidos);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreatePedido = async (pedidoData) => {
    await createPedido(pedidoData);
  };

  const handleViewDetail = (pedido) => {
    setSelectedPedido(pedido);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedPedido(null);
  };

  const handleChangeEstado = (pedido, nuevoEstado) => {
    changeEstado(pedido.id, nuevoEstado, pedido);
  };

  const handleCancelPedido = (pedido) => {
    cancelPedido(pedido);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <ClipboardList size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">
              Gestión de Pedidos
            </h2>
            <p className="text-textSecondary">
              Crea y administra los pedidos del restaurante
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary flex items-center gap-2 justify-center md:justify-start"
        >
          <Plus className="w-5 h-5" />
          Nuevo Pedido
        </button>
      </div>

      {/* Estadísticas */}
      <PedidosStats stats={stats} />

      {/* Filtros */}
      <PedidosFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        filterMesa={filterMesa}
        setFilterMesa={setFilterMesa}
        mesas={mesasParaFiltro}
        loadingMesas={loadingMesas}
      />

      {/* Lista de pedidos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando pedidos...</p>
        </div>
      ) : sortedPedidos.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg font-medium text-textMain">
            No se encontraron pedidos
          </p>
          <p className="text-textSecondary mb-4">
            {searchTerm || filterEstado !== "Todos" || filterMesa !== "Todas"
              ? "Intenta con otros filtros de búsqueda"
              : "Comienza creando tu primer pedido"}
          </p>
          {!searchTerm &&
            filterEstado === "Todos" &&
            filterMesa === "Todas" && (
              <button
                onClick={handleOpenModal}
                className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
              >
                Crear Pedido
              </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              onView={handleViewDetail}
              onChangeEstado={handleChangeEstado}
              onCancel={handleCancelPedido}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      <PedidoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleCreatePedido}
      />

      <PedidoDetailModal
        isOpen={showDetailModal}
        pedido={selectedPedido}
        onClose={handleCloseDetail}
        onChangeEstado={handleChangeEstado}
      />

      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      {/* Diálogo de confirmación */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          onConfirm={confirmDialog.onConfirm}
          onCancel={closeConfirmDialog}
          onClose={closeConfirmDialog}
        />
      )}
    </div>
  );
};

export default TomarPedido;
