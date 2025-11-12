import { useState } from "react";
import EmpleadoForm from "../../components/Empleados/EmpleadoForm";
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

  const roles = ["Todos", "mesero", "cocinero", "cajero", "host"];

  const rolesDisplay = {
    mesero: "Mesero",
    cocinero: "Cocinero",
    cajero: "Cajero",
    host: "Host",
  };

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

  const getStatusColor = (activo) => {
    return activo
      ? { bg: "#10B98120", color: "#10B981" }
      : { bg: "#6B728020", color: "#6B7280" };
  };

  const getRoleIcon = (rol) => {
    const icons = {
      mesero: "🍽️",
      cocinero: "👨‍�",
      cajero: "💰",
      host: "👔",
    };
    return icons[rol] || "�";
  };

  const EmployeeModal = () => (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleCloseModal}
    >
      <div
        className="rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-primary">
            {editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
          </h3>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <EmpleadoForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          rolesDisplay={rolesDisplay}
          roles={roles}
        />
      </div>
    </div>
  );

  const DetailModal = () => {
    if (!selectedEmployee) return null;

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={() => setShowDetailModal(false)}
      >
        <div
          className="rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "white" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-primary">
              Perfil del Empleado
            </h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 text-textMain"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-secondary/20">
              <div className="text-6xl w-20 h-20 rounded-full flex items-center justify-center bg-background">
                {getRoleIcon(selectedEmployee.rol)}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-primary">
                  {selectedEmployee.nombre} {selectedEmployee.apellido}
                </h4>
                <p className="text-textSecondary">
                  {rolesDisplay[selectedEmployee.rol]}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background">
                <p className="text-sm text-textSecondary mb-1">Email</p>
                <p className="font-medium text-textMain">
                  {selectedEmployee.email}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background">
                <p className="text-sm text-textSecondary mb-1">Teléfono</p>
                <p className="font-medium text-textMain">
                  {selectedEmployee.telefono || "No especificado"}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background">
                <p className="text-sm text-textSecondary mb-1">
                  Fecha de Ingreso
                </p>
                <p className="font-medium text-textMain">
                  {formatDate(selectedEmployee.createdAt)}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background">
                <p className="text-sm text-textSecondary mb-1">Estado</p>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium inline-block"
                  style={{
                    backgroundColor: getStatusColor(selectedEmployee.activo).bg,
                    color: getStatusColor(selectedEmployee.activo).color,
                  }}
                >
                  {selectedEmployee.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              {selectedEmployee.ultimoAcceso && (
                <div className="p-4 rounded-lg bg-background md:col-span-2">
                  <p className="text-sm text-textSecondary mb-1">
                    Último Acceso
                  </p>
                  <p className="font-medium text-textMain">
                    {formatDate(selectedEmployee.ultimoAcceso)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleOpenModal(selectedEmployee);
                }}
                className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-primary"
              >
                Editar
              </button>
              {selectedEmployee.activo ? (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    deleteEmpleado(selectedEmployee);
                  }}
                  className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-red-500"
                >
                  Desactivar
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    reactivateEmpleado(selectedEmployee);
                  }}
                  className="flex-1 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity bg-green-500"
                >
                  Reactivar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Total Empleados</p>
          <p className="text-3xl font-bold text-primary">{employees.length}</p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Activos</p>
          <p className="text-3xl font-bold text-[#10B981]">
            {employees.filter((e) => e.activo).length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Inactivos</p>
          <p className="text-3xl font-bold text-[#6B7280]">
            {employees.filter((e) => !e.activo).length}
          </p>
        </div>
        <div
          className="rounded-xl p-6 shadow-md"
          style={{ backgroundColor: "white" }}
        >
          <p className="text-sm mb-1 text-textSecondary">Roles</p>
          <p className="text-3xl font-bold text-accent">
            {new Set(employees.map((e) => e.rol)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-6 shadow-md"
        style={{ backgroundColor: "white" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-textMain">
              Buscar Empleado
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background"
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-textMain">
              Filtrar por Rol
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors border-secondary/40 bg-background"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "Todos" ? "Todos" : rolesDisplay[role] || role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => {
          const statusColor = getStatusColor(employee.activo);
          return (
            <div
              key={employee.id}
              className="rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "white" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl w-16 h-16 rounded-full flex items-center justify-center bg-background">
                    {getRoleIcon(employee.rol)}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary">
                      {employee.nombre} {employee.apellido}
                    </h3>
                    <p className="text-sm text-textSecondary">
                      {employee.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-textSecondary">Rol</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
                    {rolesDisplay[employee.rol]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-textSecondary">Teléfono</span>
                  <span className="text-sm font-medium text-text">
                    {employee.telefono || "No especificado"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-textSecondary">Estado</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.color,
                    }}
                  >
                    {employee.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="pt-3 mt-3 border-t border-secondary/20">
                  <div className="text-xs text-textSecondary">
                    <p>
                      � Registrado:{" "}
                      {new Date(employee.createdAt).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleViewDetail(employee)}
                  className="flex-1 py-2 rounded-lg font-medium border-2 hover:bg-blue-50 transition-colors text-sm border-secondary/40 text-primary"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => handleOpenModal(employee)}
                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-[#3B82F6]"
                  title="Editar"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                {employee.activo ? (
                  <button
                    onClick={() => deleteEmpleado(employee)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500"
                    title="Desactivar"
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => reactivateEmpleado(employee)}
                    className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-500"
                    title="Reactivar"
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
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

      {showModal && <EmployeeModal />}
      {showDetailModal && <DetailModal />}

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
