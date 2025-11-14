import { useState } from "react";
import MesasStats from "../../components/Mesas/MesasStats";
import MesasFilters from "../../components/Mesas/MesasFilters";
import MesaCard from "../../components/Mesas/MesaCard";
import MesaModal from "../../components/Mesas/MesaModal";
import MesaDetailModal from "../../components/Mesas/MesaDetailModal";
import AsignarMeseroModal from "../../components/Mesas/AsignarMeseroModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useMesas } from "../../hooks/useMesas";

const Mesas = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMesa, setEditingMesa] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [asigningMesa, setAsigningMesa] = useState(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium text-textMain">Cargando mesas...</p>
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
            onClick={loadMesas}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Mesas</h2>
          <p className="text-textSecondary">Gestión de mesas del restaurante</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary flex items-center gap-2 justify-center md:justify-start"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva Mesa
        </button>
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

      {filteredMesas.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-6xl mb-4">🍽️</div>
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

      {filteredMesas.length > 0 && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            backgroundColor: "#3B82F620",
            borderLeft: "4px solid #3B82F6",
          }}
        >
          <svg
            className="w-6 h-6 shrink-0 mt-0.5"
            style={{ color: "#3B82F6" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-bold text-[#3B82F6]">Consejos</p>
            <ul className="text-sm text-textSecondary mt-1 space-y-1">
              <li>• Haz clic en una mesa para ver todos sus detalles</li>
              <li>
                • Usa el botón de estado para cambiar rápidamente entre estados
              </li>
              <li>
                • Asigna meseros a las mesas para un mejor control de servicio
              </li>
            </ul>
          </div>
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
