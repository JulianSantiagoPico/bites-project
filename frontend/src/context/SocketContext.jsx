import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe ser usado dentro de un SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Solo conectar si el usuario está autenticado
    if (!isAuthenticated || !user?.restauranteId) {
      // Desconectar si existe una conexión previa
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Crear conexión si no existe
    if (!socketRef.current) {
      const SOCKET_URL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      const newSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Eventos de conexión
      newSocket.on("connect", () => {
        setConnected(true);

        // Unirse a la sala del restaurante
        if (user?.restauranteId) {
          newSocket.emit("join:restaurante", user.restauranteId);
        }
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ WebSocket desconectado:", reason);
        setConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Error de conexión WebSocket:", error.message);
        setConnected(false);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        setConnected(true);

        // Re-unirse a la sala del restaurante
        if (user?.restauranteId) {
          newSocket.emit("join:restaurante", user.restauranteId);
        }
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user?.restauranteId]);

  /**
   * Unirse a la sala de cocina
   */
  const joinCocina = () => {
    if (socketRef.current && user?.restauranteId) {
      socketRef.current.emit("join:cocina", user.restauranteId);
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
