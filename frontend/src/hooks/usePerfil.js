import { useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export const usePerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  // Cargar perfil del usuario
  const cargarPerfil = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getMe();

      if (response.success) {
        setPerfil(response.data.user);
        // Actualizar usuario en localStorage
        authService.updateCurrentUser(response.data.user);
      } else {
        setError(response.message || "Error al cargar el perfil");
      }
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError(err.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas del usuario
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getUserStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Error al cargar estadísticas");
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      setError(err.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar perfil
  const actualizarPerfil = async (datos) => {
    try {
      setActualizando(true);
      setError(null);
      const response = await authService.updateProfile(datos);

      if (response.success) {
        setPerfil(response.data.user);
        // Actualizar usuario en localStorage
        authService.updateCurrentUser(response.data.user);
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Error al actualizar el perfil");
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      const errorMsg = err.message || "Error al actualizar el perfil";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setActualizando(false);
    }
  };

  // Cambiar contraseña
  const cambiarPassword = async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    try {
      setActualizando(true);
      setError(null);
      const response = await authService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message || "Error al cambiar la contraseña");
        return { success: false, message: response.message };
      }
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      const errorMsg = err.message || "Error al cambiar la contraseña";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setActualizando(false);
    }
  };

  // Cargar perfil y estadísticas al montar
  useEffect(() => {
    cargarPerfil();
    cargarEstadisticas();
  }, [cargarPerfil, cargarEstadisticas]);

  return {
    perfil,
    stats,
    loading,
    error,
    actualizando,
    cargarPerfil,
    cargarEstadisticas,
    actualizarPerfil,
    cambiarPassword,
  };
};
