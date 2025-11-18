import { useState } from "react";
import InventarioStats from "../../components/Inventario/InventarioStats";
import InventarioFilters from "../../components/Inventario/InventarioFilters";
import InventarioTable from "../../components/Inventario/InventarioTable";
import InventarioModal from "../../components/Inventario/InventarioModal";
import InventarioDetailModal from "../../components/Inventario/InventarioDetailModal";
import StockAdjustmentModal from "../../components/Inventario/StockAdjustmentModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useInventario } from "../../hooks/useInventario";
import { Package, Plus, AlertTriangle, XCircle } from "lucide-react";

const Inventario = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);

  // Hook personalizado con toda la lógica de inventario
  const {
    items,
    loading,
    error,
    searchTerm,
    filterCategory,
    notification,
    confirmDialog,
    filteredItems,
    stats,
    setSearchTerm,
    setFilterCategory,
    loadInventario,
    saveItem,
    deleteItem,
    reactivateItem,
    ajustarStock,
    closeNotification,
    closeConfirmDialog,
  } = useInventario();

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async (formData) => {
    await saveItem(formData, editingItem);
    handleCloseModal();
  };

  const handleOpenAdjustModal = (item) => {
    setAdjustingItem(item);
    setShowAdjustModal(true);
  };

  const handleCloseAdjustModal = () => {
    setShowAdjustModal(false);
    setAdjustingItem(null);
  };

  const handleAdjustStock = async (item, ajusteData) => {
    await ajustarStock(item, ajusteData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium text-textMain">
            Cargando inventario...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
          <button
            onClick={loadInventario}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Package size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Inventario</h2>
            <p className="text-textSecondary">Control de stock y suministros</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 bg-primary"
        >
          <Plus className="w-5 h-5" />
          Agregar Item
        </button>
      </div>

      {/* Stats */}
      <InventarioStats stats={stats} />

      {/* Alerts */}
      {(stats.itemsBajoStock > 0 ||
        stats.itemsCriticos > 0 ||
        stats.itemsAgotados > 0) && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            backgroundColor: "#F59E0B20",
            borderLeft: `4px solid #F59E0B`,
          }}
        >
          <AlertTriangle
            className="w-6 h-6 shrink-0 mt-0.5"
            style={{ color: "#F59E0B" }}
          />
          <div>
            <p className="font-bold text-[#F59E0B]">Alerta de Stock</p>
            <p className="text-sm text-textSecondary">
              Hay{" "}
              {stats.itemsBajoStock + stats.itemsCriticos + stats.itemsAgotados}{" "}
              productos que requieren reposición
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <InventarioFilters
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setFilterCategory}
      />

      {/* Tabla de items */}
      <InventarioTable
        items={filteredItems}
        onEdit={handleOpenModal}
        onDelete={deleteItem}
        onReactivate={reactivateItem}
        onAdjustStock={handleOpenAdjustModal}
        onViewDetail={(item) => {
          setSelectedItem(item);
          setShowDetailModal(true);
        }}
      />

      {/* Modales */}
      <InventarioModal
        isOpen={showModal}
        item={editingItem}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />

      <InventarioDetailModal
        isOpen={showDetailModal}
        item={selectedItem}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleOpenModal}
        onDelete={deleteItem}
        onReactivate={reactivateItem}
        onAdjustStock={handleOpenAdjustModal}
      />

      <StockAdjustmentModal
        isOpen={showAdjustModal}
        item={adjustingItem}
        onAdjust={handleAdjustStock}
        onClose={handleCloseAdjustModal}
      />

      {/* Notificaciones Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
          duration={3000}
        />
      )}

      {/* Dialog de Confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={
          confirmDialog.type === "danger" ? "Desactivar" : "Reactivar"
        }
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Inventario;
