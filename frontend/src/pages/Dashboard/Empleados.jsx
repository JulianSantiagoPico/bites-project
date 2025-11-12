import { useState } from "react";
import EmpleadoForm from "../../components/Empleados/EmpleadoForm";
import EmpleadosStats from "../../components/Empleados/EmpleadosStats";
import EmpleadosFilters from "../../components/Empleados/EmpleadosFilters";
import EmpleadoCard from "../../components/Empleados/EmpleadoCard";
import EmpleadoModal from "../../components/Empleados/EmpleadoModal";
import EmpleadoDetailModal from "../../components/Empleados/EmpleadoDetailModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useEmpleados } from "../../hooks/useEmpleados";

const Empleados = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Hook personalizado con toda la lógica de empleados
  const {
    employees,
    loading,
    error,
    searchTerm,
    filterRole,
    notification,
    confirmDialog,
    filteredEmployees,
    setSearchTerm,
    setFilterRole,
    loadEmpleados,
    saveEmpleado,
    deleteEmpleado,
    reactivateEmpleado,
    closeNotification,
    closeConfirmDialog,
  } = useEmpleados();

  const handleOpenModal = (employee = null) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = async (formData) => {
    await saveEmpleado(formData, editingEmployee);
    handleCloseModal();
  };

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg font-medium text-textMain">
            Cargando empleados...
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
            onClick={loadEmpleados}
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
          <h2 className="text-3xl font-bold text-primary">Empleados</h2>
          <p className="text-textSecondary">
            Gestión del personal del restaurante
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
          Nuevo Empleado
        </button>
      </div>

      {/* Stats */}
      <EmpleadosStats employees={employees} />

      {/* Filters */}
      <EmpleadosFilters
        searchTerm={searchTerm}
        filterRole={filterRole}
        onSearchChange={setSearchTerm}
        onRoleChange={setFilterRole}
      />

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmpleadoCard
            key={employee.id}
            employee={employee}
            onViewDetail={handleViewDetail}
            onEdit={handleOpenModal}
            onDelete={deleteEmpleado}
            onReactivate={reactivateEmpleado}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-6xl mb-4">👥</div>
          <p className="text-lg font-medium text-textMain">
            No se encontraron empleados
          </p>
          <p className="text-textSecondary mb-4">
            {searchTerm || filterRole !== "Todos"
              ? "Intenta con otros filtros de búsqueda"
              : "Comienza agregando tu primer empleado"}
          </p>
          {!searchTerm && filterRole === "Todos" && (
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Agregar Empleado
            </button>
          )}
        </div>
      )}

      {/* Modales */}
      <EmpleadoModal
        isOpen={showModal}
        employee={editingEmployee}
        onSubmit={handleFormSubmit}
        onClose={handleCloseModal}
      />

      <EmpleadoDetailModal
        isOpen={showDetailModal}
        employee={selectedEmployee}
        onClose={() => setShowDetailModal(false)}
        onEdit={handleOpenModal}
        onDelete={deleteEmpleado}
        onReactivate={reactivateEmpleado}
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

export default Empleados;
