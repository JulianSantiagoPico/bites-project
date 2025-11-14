import { useState, useEffect } from "react";
import { reservasService } from "../services/api";
import {
  filtrarReservas,
  ordenarReservasPorFecha,
  calcularEstadisticas,
} from "../utils/reservasUtils";

/**
 * Hook personalizado para gestionar reservas
 * Sigue el mismo patrón que useMesas y useInventario
 */
export const useReservas = () => {
  // Estados principales
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterFecha, setFilterFecha] = useState("");

  // Estado para notificaciones
  const [notification, setNotification] = useState(null);

  // Estado para dialogo de confirmación
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "warning",
    onConfirm: null,
  });

  /**
   * Cargar todas las reservas
   */
  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reservasService.getReservas();

      if (response.success && response.data) {
        // La respuesta tiene la estructura: { success, data: { reservas: [...] } }
        const reservasArray = response.data.reservas || response.data;
        const reservasOrdenadas = ordenarReservasPorFecha(reservasArray, "asc");
        setReservas(reservasOrdenadas);
      } else {
        throw new Error(response.message || "Error al cargar reservas");
      }
    } catch (err) {
      console.error("Error al cargar reservas:", err);
      setError(err.message);
      showNotification(err.message || "Error al cargar las reservas", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Guardar reserva (crear o actualizar)
   */
  const saveReserva = async (formData, editingReserva = null) => {
    try {
      setLoading(true);

      let response;
      if (editingReserva) {
        // Actualizar reserva existente
        const reservaId =
          editingReserva["_id"] || editingReserva._id || editingReserva.id;
        response = await reservasService.updateReserva(reservaId, formData);
      } else {
        // Crear nueva reserva
        response = await reservasService.createReserva(formData);
      }

      if (response.success) {
        const mensaje = editingReserva
          ? "Reserva actualizada exitosamente"
          : "Reserva creada exitosamente";
        showNotification(mensaje, "success");
        await loadReservas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al guardar reserva:", err);
      console.error("Error details:", {
        message: err.message,
        errors: err.errors,
        status: err.status,
      });
      const errorMsg = err.errors
        ? Object.values(err.errors).join(", ")
        : err.message || "Error al guardar la reserva";
      showNotification(errorMsg, "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar reserva (soft delete)
   */
  const deleteReserva = async (reserva) => {
    const handleDelete = async () => {
      try {
        const reservaId = reserva["_id"] || reserva._id || reserva.id;
        const response = await reservasService.deleteReserva(reservaId);

        if (response.success) {
          showNotification("Reserva eliminada exitosamente", "success");
          await loadReservas();
        }
      } catch (err) {
        console.error("Error al eliminar reserva:", err);
        showNotification(
          err.message || "Error al eliminar la reserva",
          "error"
        );
      } finally {
        closeConfirmDialog();
      }
    };

    showConfirmDialog(
      "Eliminar Reserva",
      `¿Estás seguro de que deseas eliminar la reserva de ${reserva.nombreCliente}?`,
      "warning",
      handleDelete
    );
  };

  /**
   * Cambiar estado de una reserva
   */
  const changeEstado = async (reserva, nuevoEstado) => {
    const handleChange = async () => {
      try {
        const reservaId = reserva["_id"] || reserva._id || reserva.id;
        const response = await reservasService.changeEstado(
          reservaId,
          nuevoEstado
        );

        if (response.success) {
          showNotification(
            `Estado cambiado a ${nuevoEstado} exitosamente`,
            "success"
          );
          await loadReservas();
        }
      } catch (err) {
        console.error("Error al cambiar estado:", err);
        showNotification(err.message || "Error al cambiar el estado", "error");
      } finally {
        closeConfirmDialog();
      }
    };

    showConfirmDialog(
      "Cambiar Estado",
      `¿Deseas cambiar el estado de esta reserva a "${nuevoEstado}"?`,
      "warning",
      handleChange
    );
  };

  /**
   * Asignar mesa a una reserva
   */
  const asignarMesa = async (reserva, mesaId) => {
    try {
      // Usar notación de corchetes para acceder al _id
      const reservaId = reserva["_id"] || reserva._id || reserva.id;
      const response = await reservasService.asignarMesa(reservaId, mesaId);

      if (response.success) {
        const mensaje = mesaId
          ? "Mesa asignada exitosamente"
          : "Mesa desasignada exitosamente";
        showNotification(mensaje, "success");
        await loadReservas();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al asignar mesa:", err);
      showNotification(err.message || "Error al asignar la mesa", "error");
      return false;
    }
  };

  /**
   * Calcular reservas filtradas
   */
  const filteredReservas = (() => {
    const filtros = {
      estado: filterEstado === "Todos" ? null : filterEstado,
      fecha: filterFecha || null,
      busqueda: searchTerm || null,
    };

    const filtered = filtrarReservas(reservas, filtros);
    return ordenarReservasPorFecha(filtered, "asc");
  })();

  /**
   * Calcular estadísticas
   */
  const stats = calcularEstadisticas(reservas);

  // Funciones para notificaciones
  const showNotification = (message, type = "info") => {
    setNotification({
      message,
      type,
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Funciones para diálogo de confirmación
  const showConfirmDialog = (title, message, type, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      type: "warning",
      onConfirm: null,
    });
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Estados
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

    // Setters de filtros
    setSearchTerm,
    setFilterEstado,
    setFilterFecha,

    // Acciones CRUD
    loadReservas,
    saveReserva,
    deleteReserva,
    changeEstado,
    asignarMesa,

    // Acciones de notificaciones
    closeNotification,
    closeConfirmDialog,
  };
};

export default useReservas;
