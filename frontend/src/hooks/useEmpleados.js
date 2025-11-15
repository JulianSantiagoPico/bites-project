import { useState, useEffect } from "react";
import { empleadosService } from "../services/api";

export const useEmpleados = () => {
  // Estados
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Todos");
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // Cargar empleados al montar
  useEffect(() => {
    loadEmpleados();
  }, []);

  // Cargar empleados desde la API
  const loadEmpleados = async () => {
    try {
      setLoading(true);
      const response = await empleadosService.getEmpleados();
      setEmployees(response.data.users || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar empleados");
      console.error("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar empleado
  const saveEmpleado = async (formData, editingEmployee) => {
    try {
      if (editingEmployee) {
        // Actualizar empleado
        const updateData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          rol: formData.rol,
        };

        const response = await empleadosService.updateEmpleado(
          editingEmployee.id,
          updateData
        );

        // Actualizar estado local sin recargar
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === editingEmployee.id
              ? { ...emp, ...response.data.user }
              : emp
          )
        );

        showNotification("✨ Empleado actualizado exitosamente", "success");
      } else {
        // Crear nuevo empleado
        const response = await empleadosService.createEmpleado(formData);

        // Agregar nuevo empleado al estado local
        setEmployees((prevEmployees) => [...prevEmployees, response.data.user]);

        showNotification("🎉 Empleado creado exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al guardar empleado:", err);

      if (!err.errors) {
        showNotification(
          err.message ||
            "Error al guardar empleado. Por favor intenta de nuevo.",
          "error"
        );
      }

      throw err;
    }
  };

  // Desactivar empleado
  const deleteEmpleado = async (employee) => {
    setConfirmDialog({
      isOpen: true,
      title: "Desactivar Empleado",
      message: `¿Estás seguro de desactivar a ${employee.nombre} ${employee.apellido}? El empleado no podrá acceder al sistema.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await empleadosService.deleteEmpleado(employee.id);

          // Actualizar estado local
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === employee.id ? { ...emp, activo: false } : emp
            )
          );

          showNotification("👋 Empleado desactivado exitosamente", "success");
        } catch (err) {
          console.error("Error al desactivar empleado:", err);
          showNotification(
            err.message ||
              "Error al desactivar empleado. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Reactivar empleado
  const reactivateEmpleado = async (employee) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reactivar Empleado",
      message: `¿Estás seguro de reactivar a ${employee.nombre} ${employee.apellido}? El empleado podrá volver a acceder al sistema.`,
      type: "success",
      onConfirm: async () => {
        try {
          await empleadosService.reactivarEmpleado(employee.id);

          // Actualizar estado local
          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.id === employee.id ? { ...emp, activo: true } : emp
            )
          );

          showNotification("🎊 Empleado reactivado exitosamente", "success");
        } catch (err) {
          console.error("Error al reactivar empleado:", err);
          showNotification(
            err.message ||
              "Error al reactivar empleado. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Mostrar notificación
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  // Cerrar notificación
  const closeNotification = () => {
    setNotification(null);
  };

  // Cerrar dialog de confirmación
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "warning",
    });
  };

  // Filtrar empleados
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.nombre} ${emp.apellido}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "Todos" || emp.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  return {
    // Estados
    employees,
    loading,
    error,
    searchTerm,
    filterRole,
    notification,
    confirmDialog,
    filteredEmployees,

    // Setters
    setSearchTerm,
    setFilterRole,

    // Acciones
    loadEmpleados,
    saveEmpleado,
    deleteEmpleado,
    reactivateEmpleado,
    showNotification,
    closeNotification,
    closeConfirmDialog,
  };
};
