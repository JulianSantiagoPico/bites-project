import { useState } from "react";
import { CalendarX2, PartyPopper, Calendar, Plus, XCircle } from "lucide-react";
import ReservasStats from "../../components/Reservas/ReservasStats";
import ReservasFilters from "../../components/Reservas/ReservasFilters";
import ReservasTable from "../../components/Reservas/ReservasTable";
import ReservaModal from "../../components/Reservas/ReservaModal";
import ReservaDetailModal from "../../components/Reservas/ReservaDetailModal";
import AsignarMesaModal from "../../components/Reservas/AsignarMesaModal";
import OcasionesModal from "../../components/Reservas/OcasionesModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useReservas } from "../../hooks/useReservas";
import { useOcasiones } from "../../hooks/useOcasiones";
import PermissionButton from "../../components/PermissionButton";
import { PERMISSIONS } from "../../utils/permissions";

const Reservas = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [asigningReserva, setAsigningReserva] = useState(null);
  const [showOcasionesModal, setShowOcasionesModal] = useState(false);

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

  // Hook de ocasiones
  const {
    ocasiones,
    saving: savingOcasiones,
    updateOcasiones,
    getCurrentOcasiones,
  } = useOcasiones();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Calendar size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Reservas</h2>
            <p className="text-textSecondary">
              Gestión de reservas del restaurante
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <PermissionButton
            permission={PERMISSIONS.RESERVAS.MANAGE_OCCASIONS}
            onClick={() => setShowOcasionesModal(true)}
            variant="secondary"
            title="Gestionar Ocasiones"
          >
            <PartyPopper className="w-5 h-5" />
            <span className="hidden md:inline">Gestionar Ocasiones</span>
          </PermissionButton>
          <PermissionButton
            permission={PERMISSIONS.RESERVAS.CREATE}
            onClick={() => handleOpenModal()}
            variant="primary"
          >
            <Plus className="w-5 h-5" />
            Nueva Reserva
          </PermissionButton>
        </div>
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
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando reservas...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
            <button
              onClick={loadReservas}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
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
                <PermissionButton
                  permission={PERMISSIONS.RESERVAS.CREATE}
                  onClick={() => handleOpenModal()}
                  variant="primary"
                  className="mx-auto"
                >
                  Agregar Reserva
                </PermissionButton>
              )}
            </div>
          )}
        </>
      )}{" "}
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
      {/* Modal de Ocasiones */}
      <OcasionesModal
        isOpen={showOcasionesModal}
        onClose={() => setShowOcasionesModal(false)}
        currentOcasiones={ocasiones.ocasionesDisplay}
        currentIcons={ocasiones.ocasionesIcons}
        onUpdateOcasiones={async (newOcasiones) => {
          await updateOcasiones(newOcasiones);
          setShowOcasionesModal(false);
        }}
        saving={savingOcasiones}
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
