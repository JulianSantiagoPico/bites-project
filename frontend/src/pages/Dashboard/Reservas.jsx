import { useState } from "react";
import { CalendarX2 } from "lucide-react";
import ReservasStats from "../../components/Reservas/ReservasStats";
import ReservasFilters from "../../components/Reservas/ReservasFilters";
import ReservasTable from "../../components/Reservas/ReservasTable";
import ReservaModal from "../../components/Reservas/ReservaModal";
import ReservaDetailModal from "../../components/Reservas/ReservaDetailModal";
import AsignarMesaModal from "../../components/Reservas/AsignarMesaModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useReservas } from "../../hooks/useReservas";

const Reservas = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [asigningReserva, setAsigningReserva] = useState(null);

  // Hook personalizado con toda la lógica de reservas
  const {
    reservas,
    loading,
    error,
    searchTerm,
    filterEstado,
    filterFecha,
    notification,
    confirmDialog,
    filteredReservas,
    stats,
    setSearchTerm,
    setFilterEstado,
    setFilterFecha,
    loadReservas,
    saveReserva,
    deleteReserva,
    changeEstado,
    asignarMesa,
    closeNotification,
    closeConfirmDialog,
  } = useReservas();

  const handleOpenModal = (reserva = null) => {
    setEditingReserva(reserva);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReserva(null);
  };

  const handleFormSubmit = async (formData) => {
    const success = await saveReserva(formData, editingReserva);
    if (success) {
      handleCloseModal();
    }
  };

  const handleViewDetail = (reserva) => {
    setSelectedReserva(reserva);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReserva(null);
  };

  const handleChangeEstado = async (reserva, nuevoEstado) => {
    await changeEstado(reserva, nuevoEstado);
    // Cerrar el modal de detalles después de cambiar el estado
    handleCloseDetailModal();
  };

  const handleOpenAsignarModal = (reserva) => {
    setAsigningReserva(reserva);
    setShowAsignarModal(true);
  };

  const handleCloseAsignarModal = () => {
    setShowAsignarModal(false);
    setAsigningReserva(null);
  };

  const handleAsignarMesa = async (reserva, mesaId) => {
    const success = await asignarMesa(reserva, mesaId);
    if (success) {
      handleCloseAsignarModal();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium text-textMain">
            Cargando reservas...
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
            onClick={loadReservas}
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
        <div>
          <h2 className="text-3xl font-bold text-primary">Reservas</h2>
          <p className="text-textSecondary">
            Gestión de reservas del restaurante
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 bg-primary"
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
          Nueva Reserva
        </button>
      </div>

      {/* Stats */}
      <ReservasStats stats={stats} />

      {/* Filters */}
      <ReservasFilters
        searchTerm={searchTerm}
        filterEstado={filterEstado}
        filterFecha={filterFecha}
        onSearchChange={setSearchTerm}
        onEstadoChange={setFilterEstado}
        onFechaChange={setFilterFecha}
      />

      {/* Tabla de Reservas */}
      <ReservasTable
        reservas={filteredReservas}
        onViewDetail={handleViewDetail}
        onEdit={handleOpenModal}
        onDelete={deleteReserva}
        onChangeEstado={changeEstado}
        onAsignarMesa={handleOpenAsignarModal}
      />

      {filteredReservas.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="flex justify-center mb-4">
            <CalendarX2 size={64} className="text-textSecondary" />
          </div>
          <p className="text-lg font-medium text-textMain">
            No se encontraron reservas
          </p>
          <p className="text-textSecondary mb-4">
            {searchTerm || filterEstado !== "Todos" || filterFecha
              ? "Intenta con otros filtros de búsqueda"
              : "Comienza agregando tu primera reserva"}
          </p>
          {!searchTerm && filterEstado === "Todos" && !filterFecha && (
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Agregar Reserva
            </button>
          )}
        </div>
      )}

      {/* Modales */}
      <ReservaModal
        isOpen={showModal}
        reserva={editingReserva}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />

      <ReservaDetailModal
        isOpen={showDetailModal}
        reserva={selectedReserva}
        onClose={handleCloseDetailModal}
        onEdit={handleOpenModal}
        onDelete={deleteReserva}
        onChangeEstado={handleChangeEstado}
        onAsignarMesa={handleOpenAsignarModal}
      />

      <AsignarMesaModal
        isOpen={showAsignarModal}
        reserva={asigningReserva}
        onClose={handleCloseAsignarModal}
        onConfirm={handleAsignarMesa}
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
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default Reservas;
