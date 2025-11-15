import { useState } from "react";
import ProductosStats from "../../components/Productos/ProductosStats";
import ProductosFilters from "../../components/Productos/ProductosFilters";
import ProductosTable from "../../components/Productos/ProductosTable";
import ProductoModal from "../../components/Productos/ProductoModal";
import ProductoDetailModal from "../../components/Productos/ProductoDetailModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useProductos } from "../../hooks/useProductos";

const Productos = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  // Hook personalizado con toda la lógica de productos
  const {
    productos,
    loading,
    error,
    searchTerm,
    filterCategory,
    notification,
    confirmDialog,
    filteredProductos,
    stats,
    setSearchTerm,
    setFilterCategory,
    loadProductos,
    saveProducto,
    deleteProducto,
    reactivateProducto,
    toggleDisponibilidad,
    closeNotification,
    closeConfirmDialog,
  } = useProductos();

  const handleOpenModal = (producto = null) => {
    setEditingProducto(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
  };

  const handleFormSubmit = async (formData) => {
    await saveProducto(formData, editingProducto);
    handleCloseModal();
  };

  const handleViewDetail = (producto) => {
    setSelectedProducto(producto);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProducto(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium text-textMain">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
          <button
            onClick={loadProductos}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Gestión de Productos
          </h1>
          <p className="text-textSecondary mt-1">
            Administra el menú y los productos del restaurante
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <ProductosStats stats={stats} />

      {/* Filtros y búsqueda */}
      <ProductosFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        onAddNew={() => handleOpenModal()}
      />

      {/* Tabla de productos */}
      <ProductosTable
        productos={filteredProductos}
        onViewDetail={handleViewDetail}
        onEdit={handleOpenModal}
        onDelete={deleteProducto}
        onReactivate={reactivateProducto}
        onToggleDisponibilidad={toggleDisponibilidad}
      />

      {/* Modal de crear/editar */}
      <ProductoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        producto={editingProducto}
        onSubmit={handleFormSubmit}
      />

      {/* Modal de detalle */}
      <ProductoDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        producto={selectedProducto}
      />

      {/* Notificaciones */}
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
          onClose={closeConfirmDialog}
        />
      )}
    </div>
  );
};

export default Productos;
