import { useState, useEffect, useMemo } from "react";
import { mesasService, empleadosService } from "../services/api";
import { filtrarMesas } from "../utils/mesasUtils";

export const useMesas = () => {
  // Estados principales
  const [mesas, setMesas] = useState([]);
  const [meseros, setMeseros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUbicacion, setFilterUbicacion] = useState("Todas");
  const [filterEstado, setFilterEstado] = useState("Todos");

  // Estados de UI
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // Cargar mesas y meseros al montar
  useEffect(() => {
    loadMesas();
    loadMeseros();
  }, []);

  // Cargar mesas desde la API
  const loadMesas = async () => {
    try {
      setLoading(true);
      const response = await mesasService.getMesas();
      setMesas(response.data.mesas || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar las mesas");
      console.error("Error al cargar mesas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar meseros desde la API
  const loadMeseros = async () => {
    try {
      const response = await empleadosService.getEmpleados({ rol: "mesero" });
      setMeseros(response.data.empleados || []);
    } catch (err) {
      console.error("Error al cargar meseros:", err);
    }
  };

  // Crear o actualizar mesa
  const saveMesa = async (formData, editingMesa) => {
    try {
      if (editingMesa) {
        // Actualizar mesa
        const response = await mesasService.updateMesa(
          editingMesa.id,
          formData
        );

        // Actualizar estado local
        setMesas((prevMesas) =>
          prevMesas.map((mesa) =>
            mesa.id === editingMesa.id
              ? { ...mesa, ...response.data.mesa }
              : mesa
          )
        );

        showNotification("✨ Mesa actualizada exitosamente", "success");
      } else {
        // Crear nueva mesa
        const response = await mesasService.createMesa(formData);

        // Agregar nueva mesa al estado local
        setMesas((prevMesas) => [...prevMesas, response.data.mesa]);

        showNotification("✅ Mesa creada exitosamente", "success");
      }
    } catch (err) {
      const errorMsg =
        err.message ||
        `Error al ${editingMesa ? "actualizar" : "crear"} la mesa`;
      showNotification(`❌ ${errorMsg}`, "error");
      throw err;
    }
  };

  // Eliminar mesa (soft delete)
  const deleteMesa = (mesa) => {
    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Mesa",
      message: `¿Estás seguro de que deseas eliminar la Mesa #${mesa.numero}? Esta acción se puede revertir.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await mesasService.deleteMesa(mesa.id);

          // Actualizar estado local
          setMesas((prevMesas) =>
            prevMesas.map((m) =>
              m.id === mesa.id ? { ...m, activo: false } : m
            )
          );

          showNotification("🗑️ Mesa eliminada exitosamente", "success");
        } catch (err) {
          const errorMsg = err.message || "Error al eliminar la mesa";
          showNotification(`❌ ${errorMsg}`, "error");
        } finally {
          closeConfirmDialog();
        }
      },
    });
  };

  // Cambiar estado de la mesa
  const changeEstado = (mesa, nuevoEstado) => {
    setConfirmDialog({
      isOpen: true,
      title: "Cambiar Estado",
      message: `¿Cambiar el estado de la Mesa #${mesa.numero} a ${nuevoEstado}?`,
      type: "warning",
      onConfirm: async () => {
        try {
          await mesasService.changeEstado(mesa.id, nuevoEstado);

          // Actualizar estado local
          setMesas((prevMesas) =>
            prevMesas.map((m) =>
              m.id === mesa.id ? { ...m, estado: nuevoEstado } : m
            )
          );

          showNotification("🔄 Estado actualizado exitosamente", "success");
        } catch (err) {
          const errorMsg = err.message || "Error al cambiar el estado";
          showNotification(`❌ ${errorMsg}`, "error");
        } finally {
          closeConfirmDialog();
        }
      },
    });
  };

  // Asignar mesero a una mesa
  const asignarMesero = async (mesa, meseroId) => {
    try {
      const response = await mesasService.asignarMesero(mesa.id, meseroId);

      // Actualizar estado local
      setMesas((prevMesas) =>
        prevMesas.map((m) =>
          m.id === mesa.id ? { ...m, ...response.data.mesa } : m
        )
      );

      showNotification(
        meseroId
          ? "👤 Mesero asignado exitosamente"
          : "👤 Mesero desasignado exitosamente",
        "success"
      );
    } catch (err) {
      const errorMsg = err.message || "Error al asignar mesero";
      showNotification(`❌ ${errorMsg}`, "error");
      throw err;
    }
  };

  // Reactivar mesa
  const reactivarMesa = (mesa) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reactivar Mesa",
      message: `¿Deseas reactivar la Mesa #${mesa.numero}?`,
      type: "success",
      onConfirm: async () => {
        try {
          await mesasService.updateMesa(mesa.id, { activo: true });

          // Actualizar estado local
          setMesas((prevMesas) =>
            prevMesas.map((m) =>
              m.id === mesa.id ? { ...m, activo: true } : m
            )
          );

          showNotification("♻️ Mesa reactivada exitosamente", "success");
        } catch (err) {
          const errorMsg = err.message || "Error al reactivar la mesa";
          showNotification(`❌ ${errorMsg}`, "error");
        } finally {
          closeConfirmDialog();
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

  // Cerrar diálogo de confirmación
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => {},
      type: "warning",
    });
  };

  // Mesas filtradas (memoizado para performance)
  const filteredMesas = useMemo(() => {
    return filtrarMesas(mesas, searchTerm, filterUbicacion, filterEstado);
  }, [mesas, searchTerm, filterUbicacion, filterEstado]);

  // Estadísticas (memoizado para performance)
  const stats = useMemo(() => {
    const mesasActivas = mesas.filter((m) => m.activo);

    return {
      total: mesasActivas.length,
      disponibles: mesasActivas.filter((m) => m.estado === "disponible").length,
      ocupadas: mesasActivas.filter((m) => m.estado === "ocupada").length,
      reservadas: mesasActivas.filter((m) => m.estado === "reservada").length,
      enLimpieza: mesasActivas.filter((m) => m.estado === "en_limpieza").length,
      capacidadTotal: mesasActivas.reduce((sum, m) => sum + m.capacidad, 0),
      tasaOcupacion:
        mesasActivas.length > 0
          ? (
              (mesasActivas.filter((m) => m.estado === "ocupada").length /
                mesasActivas.length) *
              100
            ).toFixed(1)
          : 0,
      porUbicacion: {
        Interior: mesasActivas.filter((m) => m.ubicacion === "Interior").length,
        Terraza: mesasActivas.filter((m) => m.ubicacion === "Terraza").length,
        Bar: mesasActivas.filter((m) => m.ubicacion === "Bar").length,
        VIP: mesasActivas.filter((m) => m.ubicacion === "VIP").length,
      },
    };
  }, [mesas]);

  return {
    // Datos
    mesas,
    meseros,
    loading,
    error,

    // Filtros
    searchTerm,
    filterUbicacion,
    filterEstado,
    setSearchTerm,
    setFilterUbicacion,
    setFilterEstado,

    // UI States
    notification,
    confirmDialog,

    // Datos computados
    filteredMesas,
    stats,

    // Acciones
    loadMesas,
    saveMesa,
    deleteMesa,
    changeEstado,
    asignarMesero,
    reactivarMesa,
    closeNotification,
    closeConfirmDialog,
  };
};
