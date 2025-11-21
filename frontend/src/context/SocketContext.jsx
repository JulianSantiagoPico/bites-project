import { createContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

// Exportar el contexto para que pueda ser usado por el hook
export { SocketContext };

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const restauranteIdRef = useRef(null);

  useEffect(() => {
    // Solo conectar si el usuario está autenticado
    if (!isAuthenticated || !user?.restauranteId) {
      // Desconectar si existe una conexión previa
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
        restauranteIdRef.current = null;
      }
      return;
    }

    // Si ya existe una conexión y el restauranteId no ha cambiado, no hacer nada
    if (socketRef.current && restauranteIdRef.current === user.restauranteId) {
      return;
    }

    // Si cambió el restauranteId, desconectar y limpiar
    if (socketRef.current && restauranteIdRef.current !== user.restauranteId) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // Crear nueva conexión
    // Asegurar que restauranteId sea un string
    const restauranteId =
      typeof user.restauranteId === "object"
        ? user.restauranteId._id || user.restauranteId.toString()
        : String(user.restauranteId);
    restauranteIdRef.current = restauranteId;

    // Determinar la URL del Socket
    let socketUrl = import.meta.env.VITE_SOCKET_URL;

    if (!socketUrl) {
      // Si no hay VITE_SOCKET_URL, intentar usar VITE_API_URL
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      // Si la API URL termina en /api, se lo quitamos para obtener la raíz
      socketUrl = apiUrl.replace(/\/api\/?$/, "");
    }

    console.log("🔌 Conectando a WebSocket:", socketUrl);

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      upgrade: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      withCredentials: true,
    });

    // Eventos de conexión
    newSocket.on("connect", () => {
      console.log("✅ WebSocket conectado:", newSocket.id);
      setConnected(true);

      // Unirse a la sala del restaurante
      if (restauranteIdRef.current) {
        console.log("📡 Uniéndose a restaurante:", restauranteIdRef.current);
        newSocket.emit("join:restaurante", String(restauranteIdRef.current));
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ WebSocket desconectado:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Error de conexión WebSocket:", error.message);
      console.error("Detalles del error:", error);
      setConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 WebSocket reconectado (intento ${attemptNumber})`);
      setConnected(true);

      // Re-unirse a la sala del restaurante
      if (restauranteIdRef.current) {
        console.log("📡 Re-uniéndose a restaurante:", restauranteIdRef.current);
        newSocket.emit("join:restaurante", String(restauranteIdRef.current));
      }
    });

    // Confirmaciones de unión a salas
    newSocket.on("joined:restaurante", (data) => {
      console.log("✅ Unido a sala de restaurante:", data);
    });

    newSocket.on("joined:cocina", (data) => {
      console.log("✅ Unido a sala de cocina:", data);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        restauranteIdRef.current = null;
      }
    };
  }, [isAuthenticated, user?.restauranteId]);

  /**
   * Unirse a la sala de cocina
   */
  const joinCocina = () => {
    if (socketRef.current && user?.restauranteId) {
      const restauranteId =
        typeof user.restauranteId === "object"
          ? user.restauranteId._id || user.restauranteId.toString()
          : String(user.restauranteId);
      socketRef.current.emit("join:cocina", restauranteId);
    }
  };

  /**
   * Suscribirse a un evento
   */
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  /**
   * Desuscribirse de un evento
   */
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  /**
   * Emitir un evento
   */
  const emit = (event, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("⚠️ Socket no conectado, no se puede emitir evento:", event);
    }
  };

  const value = {
    socket,
    connected,
    joinCocina,
    on,
    off,
    emit,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
