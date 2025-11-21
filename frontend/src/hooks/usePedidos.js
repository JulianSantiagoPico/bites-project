import { useState, useEffect } from "react";
import { pedidosService } from "../services/api";
import { filterPedidos, calculatePedidosStats } from "../utils/pedidosUtils";
import { useSocket } from "./useSocket";

export const usePedidos = () => {
  // Estados
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterMesa, setFilterMesa] = useState("Todas");
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // Hook de WebSocket
  const { on, off } = useSocket();

  // Cargar pedidos al montar
  useEffect(() => {
    loadPedidos();
  }, []);

  // Escuchar eventos de WebSocket
  useEffect(() => {
    if (!on || !off) return;

    // Evento: Nuevo pedido creado
    const handleNuevoPedido = (data) => {
      console.log("🆕 Nuevo pedido recibido:", data.pedido);
      setPedidos((prevPedidos) => [data.pedido, ...prevPedidos]);
    };

    // Evento: Cambio de estado de pedido
    const handleCambioEstado = (data) => {
      console.log("🔄 Cambio de estado recibido:", data.pedido);
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === data.pedido.id ? { ...p, ...data.pedido } : p
        )
      );
    };

    // Evento: Pedido actualizado
    const handlePedidoActualizado = (data) => {
      console.log("✏️ Pedido actualizado recibido:", data.pedido);
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === data.pedido.id ? { ...p, ...data.pedido } : p
        )
      );
    };

    // Evento: Pedido cancelado
    const handlePedidoCancelado = (data) => {
      console.log("❌ Pedido cancelado recibido:", data.pedido);
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          p.id === data.pedido.id ? { ...p, ...data.pedido } : p
        )
      );
    };

    // Suscribirse a eventos
    on("pedido:nuevo", handleNuevoPedido);
    on("pedido:cambioEstado", handleCambioEstado);
    on("pedido:actualizado", handlePedidoActualizado);
    on("pedido:cancelado", handlePedidoCancelado);

    // Cleanup: desuscribirse al desmontar
    return () => {
      off("pedido:nuevo", handleNuevoPedido);
      off("pedido:cambioEstado", handleCambioEstado);
      off("pedido:actualizado", handlePedidoActualizado);
      off("pedido:cancelado", handlePedidoCancelado);
    };
  }, [on, off]);

  // Cargar pedidos desde la API
  const loadPedidos = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await pedidosService.getPedidos(filters);
      setPedidos(response.data.pedidos || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al cargar los pedidos");
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo pedido
  const createPedido = async (pedidoData) => {
    try {
      const response = await pedidosService.createPedido(pedidoData);

      // Agregar nuevo pedido al estado local
      setPedidos((prevPedidos) => [response.data.pedido, ...prevPedidos]);

      showNotification("🎉 Pedido creado exitosamente", "success");
      return response.data.pedido;
    } catch (err) {
      console.error("Error al crear pedido:", err);

      if (!err.errors) {
        showNotification(
          err.message ||
            "Error al crear el pedido. Por favor intenta de nuevo.",
          "error"
        );
      }

      throw err;
    }
  };

  // Actualizar pedido (solo en estado pendiente)
  const updatePedido = async (pedidoId, pedidoData) => {
    try {
      const response = await pedidosService.updatePedido(pedidoId, pedidoData);

      // Actualizar estado local
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, ...response.data.pedido }
            : pedido
        )
      );

      showNotification("✨ Pedido actualizado exitosamente", "success");
      return response.data.pedido;
    } catch (err) {
      console.error("Error al actualizar pedido:", err);

      if (!err.errors) {
        showNotification(
          err.message ||
            "Error al actualizar el pedido. Por favor intenta de nuevo.",
          "error"
        );
      }

      throw err;
    }
  };

  // Cambiar estado del pedido
  const changeEstado = async (pedidoId, nuevoEstado, pedido) => {
    const estadoLabels = {
      en_preparacion: "en preparación",
      listo: "listo",
      entregado: "entregado",
      cancelado: "cancelado",
    };

    const newDialog = {
      isOpen: true,
      title: `Cambiar estado a ${estadoLabels[nuevoEstado] || nuevoEstado}`,
      message: `¿Confirmar el cambio de estado del pedido ${
        pedido?.numeroPedido || ""
      }?`,
      type: nuevoEstado === "cancelado" ? "danger" : "info",
      onConfirm: async () => {
        // Cerrar el diálogo primero
        closeConfirmDialog();

        try {
          const response = await pedidosService.changeEstado(
            pedidoId,
            nuevoEstado
          );

          // Actualizar estado local
          setPedidos((prevPedidos) =>
            prevPedidos.map((p) =>
              p.id === pedidoId ? { ...p, ...response.data.pedido } : p
            )
          );

          showNotification(
            `✅ Pedido marcado como ${estadoLabels[nuevoEstado]}`,
            "success"
          );
        } catch (err) {
          console.error("Error al cambiar estado:", err);
          showNotification(
            err.message ||
              "Error al cambiar el estado. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    };
    setConfirmDialog(newDialog);
  };

  // Cancelar pedido
  const cancelPedido = async (pedido) => {
    setConfirmDialog({
      isOpen: true,
      title: "Cancelar Pedido",
      message: `¿Estás seguro de cancelar el pedido ${pedido.numeroPedido}? Esta acción no se puede deshacer.`,
      type: "danger",
      onConfirm: async () => {
        // Cerrar el diálogo primero
        closeConfirmDialog();

        try {
          const response = await pedidosService.cancelPedido(pedido.id);

          // Actualizar estado local
          setPedidos((prevPedidos) =>
            prevPedidos.map((p) =>
              p.id === pedido.id ? { ...p, ...response.data.pedido } : p
            )
          );

          showNotification("❌ Pedido cancelado exitosamente", "success");
        } catch (err) {
          console.error("Error al cancelar pedido:", err);
          showNotification(
            err.message ||
              "Error al cancelar el pedido. Por favor intenta de nuevo.",
            "error"
          );
        }
      },
    });
  };

  // Obtener pedidos de una mesa específica
  const getPedidosByMesa = async (mesaId) => {
    try {
      const response = await pedidosService.getPedidosByMesa(mesaId);
      return response.data.pedidos || [];
    } catch (err) {
      console.error("Error al obtener pedidos de la mesa:", err);
      showNotification(
        err.message || "Error al obtener los pedidos de la mesa",
        "error"
      );
      return [];
    }
  };

  // Obtener estadísticas
  const getEstadisticas = async (filters = {}) => {
    try {
      const response = await pedidosService.getEstadisticas(filters);
      return response.data.stats || {};
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
      return {};
    }
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

  // Filtrar pedidos
  const filteredPedidos = pedidos.filter((pedido) => {
    // Filtrar por búsqueda
    const matchesSearch = filterPedidos([pedido], searchTerm).length > 0;
    if (!matchesSearch) return false;

    // Filtrar por estado
    if (filterEstado !== "Todos" && pedido.estado !== filterEstado) {
      return false;
    }

    // Filtrar por mesa
    if (filterMesa !== "Todas") {
      const mesaNumero = pedido.mesaId?.numero?.toString();
      if (mesaNumero !== filterMesa) return false;
    }

    return true;
  });

  // Calcular estadísticas de pedidos filtrados
  const stats = calculatePedidosStats(filteredPedidos);

  return {
    // Estados
    pedidos,
    loading,
    error,
    searchTerm,
    filterEstado,
    filterMesa,
    notification,
    confirmDialog,

    // Datos procesados
    filteredPedidos,
    stats,

    // Setters
    setSearchTerm,
    setFilterEstado,
    setFilterMesa,

    // Acciones
    loadPedidos,
    createPedido,
    updatePedido,
    changeEstado,
    cancelPedido,
    getPedidosByMesa,
    getEstadisticas,

    // Notificaciones
    showNotification,
    closeNotification,
    closeConfirmDialog,
  };
};
