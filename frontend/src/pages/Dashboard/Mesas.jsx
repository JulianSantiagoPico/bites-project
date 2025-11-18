import { useState } from "react";
import MesasStats from "../../components/Mesas/MesasStats";
import MesasFilters from "../../components/Mesas/MesasFilters";
import MesaCard from "../../components/Mesas/MesaCard";
import MesaModal from "../../components/Mesas/MesaModal";
import MesaDetailModal from "../../components/Mesas/MesaDetailModal";
import AsignarMeseroModal from "../../components/Mesas/AsignarMeseroModal";
import UbicacionesModal from "../../components/Mesas/UbicacionesModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useMesas } from "../../hooks/useMesas";
import { useUbicaciones } from "../../hooks/useUbicaciones";
import { Settings, Table, Plus, XCircle, UtensilsCrossed } from "lucide-react";

const Mesas = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMesa, setEditingMesa] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [asigningMesa, setAsigningMesa] = useState(null);
  const [showUbicacionesModal, setShowUbicacionesModal] = useState(false);

  const {
    meseros,
    loading,
    error,
    searchTerm,
    filterUbicacion,
    filterEstado,
    notification,
    confirmDialog,
    filteredMesas,
    stats,
    setSearchTerm,
    setFilterUbicacion,
    setFilterEstado,
    loadMesas,
    saveMesa,
    deleteMesa,
    changeEstado,
    asignarMesero,
    closeNotification,
    closeConfirmDialog,
  } = useMesas();

  const {
    ubicaciones,
    saving: savingUbicaciones,
    updateUbicaciones,
    getCurrentUbicaciones,
  } = useUbicaciones();

  const handleOpenModal = (mesa = null) => {
    setEditingMesa(mesa);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMesa(null);
  };

  const handleFormSubmit = async (formData) => {
    await saveMesa(formData, editingMesa);
    handleCloseModal();
  };

  const handleViewDetail = (mesa) => {
    setSelectedMesa(mesa);
    setShowDetailModal(true);
  };

  const handleOpenAsignarModal = (mesa) => {
    setAsigningMesa(mesa);
    setShowAsignarModal(true);
  };

  const handleCloseAsignarModal = () => {
    setShowAsignarModal(false);
    setAsigningMesa(null);
  };

  const handleAsignarMesero = async (mesa, meseroId) => {
    await asignarMesero(mesa, meseroId);
  };

  const handleUpdateUbicaciones = async (ubicacionesData) => {
    const result = await updateUbicaciones(ubicacionesData);
    if (result.success) {
      setShowUbicacionesModal(false);
      // Recargar mesas para reflejar los cambios
      await loadMesas();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Table size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Mesas</h2>
            <p className="text-textSecondary">
              Gestión de mesas del restaurante
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowUbicacionesModal(true)}
            className="px-4 py-3 rounded-lg font-medium text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 justify-center"
            title="Gestionar Ubicaciones"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Gestionar Ubicaciones</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary flex items-center gap-2 justify-center md:justify-start"
          >
            <Plus className="w-5 h-5" />
            Nueva Mesa
          </button>
        </div>
      </div>

      <MesasStats stats={stats} />

      <MesasFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterUbicacion={filterUbicacion}
        setFilterUbicacion={setFilterUbicacion}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando mesas...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
            <button
              onClick={loadMesas}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : filteredMesas.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium text-textMain">
            No se encontraron mesas
          </p>
          <p className="text-textSecondary mb-4">
            {searchTerm ||
            filterUbicacion !== "Todas" ||
            filterEstado !== "Todos"
              ? "Intenta con otros filtros de búsqueda"
              : "Comienza agregando tu primera mesa"}
          </p>
          {!searchTerm &&
            filterUbicacion === "Todas" &&
            filterEstado === "Todos" && (
              <button
                onClick={() => handleOpenModal()}
                className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
              >
                Agregar Mesa
              </button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMesas.map((mesa) => (
            <MesaCard
              key={mesa.id}
              mesa={mesa}
              onView={handleViewDetail}
              onEdit={handleOpenModal}
              onDelete={deleteMesa}
              onChangeEstado={changeEstado}
              onAssign={handleOpenAsignarModal}
            />
          ))}
        </div>
      )}

      <MesaModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={editingMesa}
      />

      <MesaDetailModal
        mesa={selectedMesa}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleOpenModal}
      />

      <AsignarMeseroModal
        mesa={asigningMesa}
        meseros={meseros}
        isOpen={showAsignarModal}
        onClose={handleCloseAsignarModal}
        onConfirm={handleAsignarMesero}
      />

      <UbicacionesModal
        isOpen={showUbicacionesModal}
        onClose={() => setShowUbicacionesModal(false)}
        currentUbicaciones={getCurrentUbicaciones()}
        onUpdateUbicaciones={handleUpdateUbicaciones}
        saving={savingUbicaciones}
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

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

export default Mesas;
