import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/**
 * Hook para acceder al contexto de Socket.IO
 * @returns {Object} Objeto con socket, connected, y métodos de Socket.IO
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket debe ser usado dentro de un SocketProvider");
  }
  return context;
};
