import { useState, useEffect, useCallback } from "react";
import cocinaService from "../services/cocina.service";
import { useSocket } from "../context/SocketContext";

/**
 * Hook personalizado para gestionar el módulo de cocina
 * Incluye lógica de estado, API calls y eventos en tiempo real
 */
export const useCocina = () => {
  // Estados
  const [ordenes, setOrdenes] = useState([]);
  const [stats, setStats] = useState({
    pendientes: 0,
    enPreparacion: 0,
    listosHoy: 0,
    completadosHoy: 0,
    tiempoEsperaMasLargo: 0,
    tiempoPromedioPreparacion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [notification, setNotification] = useState(null);

  // Socket.IO
  const { on, off, joinCocina, connected } = useSocket();

  /**
   * Cargar órdenes desde la API
   */
  const loadOrdenes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const estado = filterEstado !== "Todos" ? filterEstado : null;
      const response = await cocinaService.getPedidosCocina(estado);

      setOrdenes(response.data.pedidos || []);
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      setError(err.message || "Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  }, [filterEstado]);

  /**
   * Cargar estadísticas desde la API
   */
  const loadStats = useCallback(async () => {
    try {
      const response = await cocinaService.getEstadisticasCocina();
      setStats(response.data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  }, []);

  /**
   * Comenzar preparación de una orden
   */
  const comenzarPreparacion = async (orden) => {
    try {
      // Validar que la orden tiene ID
      if (!orden || !orden._id) {
        console.error("Error: Orden sin ID", orden);
        showNotification("Error: Orden inválida", "error");
        return;
      }

      await cocinaService.comenzarPreparacion(orden._id);

      // Actualizar localmente
      setOrdenes((prev) =>
        prev.map((o) =>
          o._id === orden._id ? { ...o, estado: "en_preparacion" } : o
        )
      );

      showNotification(
        `Preparación iniciada: ${orden.numeroPedido}`,
        "success"
      );

      // Recargar estadísticas
      loadStats();
    } catch (err) {
      console.error("Error al comenzar preparación:", err);
      showNotification(err.message || "Error al comenzar preparación", "error");
    }
  };

  /**
   * Terminar preparación de una orden
   */
  const terminarPreparacion = async (orden) => {
    try {
      // Validar que la orden tiene ID
      if (!orden || !orden._id) {
        console.error("Error: Orden sin ID", orden);
        showNotification("Error: Orden inválida", "error");
        return;
      }

      await cocinaService.terminarPreparacion(orden._id);

      // Remover de la lista (ya no es relevante para cocina)
      setOrdenes((prev) => prev.filter((o) => o._id !== orden._id));

      showNotification(`Pedido listo: ${orden.numeroPedido}`, "success");

      // Recargar estadísticas
      loadStats();
    } catch (err) {
      console.error("Error al terminar preparación:", err);
      showNotification(err.message || "Error al terminar preparación", "error");
    }
  };

  /**
   * Mostrar notificación
   */
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  /**
   * Cerrar notificación
   */
  const closeNotification = () => {
    setNotification(null);
  };

  /**
   * Reproducir sonido de notificación
   */
  const playNotificationSound = () => {
    // Crear un beep simple con Web Audio API
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.warn("No se pudo reproducir sonido:", err);
    }
  };

  // Configurar eventos de Socket.IO
  useEffect(() => {
    if (!connected) return;

    // Unirse a la sala de cocina
    joinCocina();

    // Nuevo pedido
    const handleNuevoPedido = (data) => {
      // Solo agregar si está en el filtro actual
      if (
        filterEstado === "Todos" ||
        filterEstado === "pendiente" ||
        data.pedido.estado === filterEstado
      ) {
        setOrdenes((prev) => {
          // Evitar duplicados
          if (prev.some((o) => o._id === data.pedido._id)) {
            return prev;
          }
          return [data.pedido, ...prev];
        });
      }

      // Actualizar estadísticas
      loadStats();

      // Notificar y reproducir sonido
      showNotification(`Nuevo pedido: ${data.pedido.numeroPedido}`, "info");
      playNotificationSound();
    };

    // Cambio de estado
    const handleCambioEstado = (data) => {
      setOrdenes((prev) => {
        // Si el pedido cambió a un estado que no es relevante para cocina, removerlo
        if (!["pendiente", "en_preparacion"].includes(data.pedido.estado)) {
          return prev.filter((o) => o._id !== data.pedido._id);
        }

        // Actualizar el pedido existente
        return prev.map((o) =>
          o._id === data.pedido._id ? { ...data.pedido } : o
        );
      });

      // Actualizar estadísticas
      loadStats();

      // Notificar si el pedido está listo
      if (data.pedido.estado === "listo") {
        showNotification(
          `Pedido listo: ${data.pedido.numeroPedido}`,
          "success"
        );
        playNotificationSound();
      }
    };

    // Pedido actualizado
    const handlePedidoActualizado = (data) => {
      setOrdenes((prev) =>
        prev.map((o) => (o._id === data.pedido._id ? { ...data.pedido } : o))
      );
    };

    // Pedido cancelado
    const handlePedidoCancelado = (data) => {
      // Remover de la lista
      setOrdenes((prev) => prev.filter((o) => o._id !== data.pedido._id));

      // Actualizar estadísticas
      loadStats();

      showNotification(
        `Pedido cancelado: ${data.pedido.numeroPedido}`,
        "warning"
      );
    };

    // Suscribirse a eventos
    on("cocina:nuevoPedido", handleNuevoPedido);
    on("pedido:cambioEstado", handleCambioEstado);
    on("cocina:pedidoActualizado", handlePedidoActualizado);
    on("cocina:pedidoCancelado", handlePedidoCancelado);

    // Cleanup
    return () => {
      off("cocina:nuevoPedido", handleNuevoPedido);
      off("pedido:cambioEstado", handleCambioEstado);
      off("cocina:pedidoActualizado", handlePedidoActualizado);
      off("cocina:pedidoCancelado", handlePedidoCancelado);
    };
  }, [connected, filterEstado, joinCocina, on, off, loadStats]);

  // Cargar datos iniciales
  useEffect(() => {
    loadOrdenes();
    loadStats();
  }, [loadOrdenes, loadStats]);

  // Actualizar órdenes periódicamente (cada 30 segundos como fallback)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        loadStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, loadStats]);

  return {
    ordenes,
    stats,
    loading,
    error,
    filterEstado,
    notification,
    connected,
    setFilterEstado,
    comenzarPreparacion,
    terminarPreparacion,
    loadOrdenes,
    closeNotification,
  };
};
