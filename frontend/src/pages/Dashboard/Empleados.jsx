import { useState } from "react";
import { Settings, Users, Plus, XCircle, UsersRound } from "lucide-react";
import EmpleadoForm from "../../components/Empleados/EmpleadoForm";
import EmpleadosStats from "../../components/Empleados/EmpleadosStats";
import EmpleadosFilters from "../../components/Empleados/EmpleadosFilters";
import EmpleadoCard from "../../components/Empleados/EmpleadoCard";
import EmpleadoModal from "../../components/Empleados/EmpleadoModal";
import EmpleadoDetailModal from "../../components/Empleados/EmpleadoDetailModal";
import RolesModal from "../../components/Empleados/RolesModal";
import Notification from "../../components/Notification";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useEmpleados } from "../../hooks/useEmpleados";
import { useRoles } from "../../hooks/useRoles";
import { getCurrentRoles } from "../../utils/empleadosUtils";
import PermissionButton from "../../components/PermissionButton";
import { PERMISSIONS } from "../../utils/permissions";

const Empleados = () => {
  // Estados locales del componente (UI)
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [rolesSaving, setRolesSaving] = useState(false);

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
    showNotification,
    closeNotification,
    closeConfirmDialog,
  } = useEmpleados();

  // Hook para gestionar roles
  const { saveRoles } = useRoles();

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

  const handleUpdateRoles = async ({ rolesDisplay, rolesList, rolesIcons }) => {
    setRolesSaving(true);

    const result = await saveRoles({
      rolesDisplay,
      rolesIcons,
    });

    setRolesSaving(false);

    if (result.success) {
      // Cerrar el modal de roles
      setShowRolesModal(false);
      // Recargar empleados para actualizar los filtros
      loadEmpleados();
    } else {
      // Mostrar error si falla
      alert(result.error || "Error al actualizar roles");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Users size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary">Empleados</h2>
            <p className="text-textSecondary">
              Gestión del personal del restaurante
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <PermissionButton
            permission={PERMISSIONS.EMPLEADOS.MANAGE_ROLES}
            onClick={() => setShowRolesModal(true)}
            variant="secondary"
            title="Gestionar Roles"
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">Roles</span>
          </PermissionButton>
          <PermissionButton
            permission={PERMISSIONS.EMPLEADOS.CREATE}
            onClick={() => handleOpenModal()}
            variant="primary"
          >
            <Plus className="w-5 h-5" />
            Nuevo Empleado
          </PermissionButton>
        </div>
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
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="text-textSecondary mt-4">Cargando empleados...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-500 mb-4">{error}</p>
            <button
              onClick={loadEmpleados}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
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
              <UsersRound className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-textMain">
                No se encontraron empleados
              </p>
              <p className="text-textSecondary mb-4">
                {searchTerm || filterRole !== "Todos"
                  ? "Intenta con otros filtros de búsqueda"
                  : "Comienza agregando tu primer empleado"}
              </p>
              {!searchTerm && filterRole === "Todos" && (
                <PermissionButton
                  permission={PERMISSIONS.EMPLEADOS.CREATE}
                  onClick={() => handleOpenModal()}
                  variant="primary"
                >
                  Agregar Empleado
                </PermissionButton>
              )}
            </div>
          )}
        </>
      )}{" "}
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
      <RolesModal
        isOpen={showRolesModal}
        onClose={() => setShowRolesModal(false)}
        currentRoles={getCurrentRoles().rolesDisplay}
        currentIcons={getCurrentRoles().rolesIcons}
        onUpdateRoles={handleUpdateRoles}
        saving={rolesSaving}
        showNotification={showNotification}
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
