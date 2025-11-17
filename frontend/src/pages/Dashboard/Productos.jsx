import { useState } from "react";
import ProductosStats from "../../components/Productos/ProductosStats";
import ProductosFilters from "../../components/Productos/ProductosFilters";
import ProductosTable from "../../components/Productos/ProductosTable";
import ProductoModal from "../../components/Productos/ProductoModal";
import ProductoDetailModal from "../../components/Productos/ProductoDetailModal";
import CategoriasModal from "../../components/Productos/CategoriasModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useProductos } from "../../hooks/useProductos";
import { useCategorias } from "../../hooks/useCategorias";
import { Settings, Package, Plus } from "lucide-react";

const Productos = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

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

  const {
    categorias,
    saving: savingCategorias,
    updateCategorias,
    getCurrentCategorias,
  } = useCategorias();

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

  const handleUpdateCategorias = async (categoriasData) => {
    const result = await updateCategorias(categoriasData);
    if (result.success) {
      setShowCategoriasModal(false);
      // Recargar productos para reflejar los cambios
      await loadProductos();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Package size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">
              Gestión de Productos
            </h2>
            <p className="text-textSecondary">
              Administra el menú y los productos del restaurante
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoriasModal(true)}
            className="px-4 py-3 rounded-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 justify-center"
            title="Gestionar Categorías"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Gestionar Categorías</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary flex items-center gap-2 justify-center md:justify-start"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
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
      />

      {/* Tabla de productos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando productos...</p>
        </div>
      ) : error ? (
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
      ) : (
        <ProductosTable
          productos={filteredProductos}
          onViewDetail={handleViewDetail}
          onEdit={handleOpenModal}
          onDelete={deleteProducto}
          onReactivate={reactivateProducto}
          onToggleDisponibilidad={toggleDisponibilidad}
        />
      )}

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

      {/* Modal de categorías */}
      <CategoriasModal
        isOpen={showCategoriasModal}
        onClose={() => setShowCategoriasModal(false)}
        currentCategorias={getCurrentCategorias()}
        onUpdateCategorias={handleUpdateCategorias}
        saving={savingCategorias}
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
