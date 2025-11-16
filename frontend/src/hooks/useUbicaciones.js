import { useState, useEffect } from "react";
import { ubicacionesService } from "../services/ubicaciones.service";

/**
 * Hook para gestionar las ubicaciones del restaurante
 */
export const useUbicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState({
    ubicacionesDisplay: {},
    ubicacionesList: [],
    ubicacionesIcons: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar ubicaciones al montar
  useEffect(() => {
    loadUbicaciones();
  }, []);

  const loadUbicaciones = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ubicacionesService.getUbicaciones();
      setUbicaciones(
        response.data || {
          ubicacionesDisplay: {},
          ubicacionesList: [],
          ubicacionesIcons: {},
        }
      );
    } catch (err) {
      console.error("Error al cargar ubicaciones:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUbicaciones = async (newUbicaciones) => {
    setSaving(true);
    setError(null);

    try {
      const response = await ubicacionesService.updateUbicaciones(
        newUbicaciones
      );
      setUbicaciones(response.data);

      // Actualizar localStorage para que esté disponible inmediatamente
      localStorage.setItem("customUbicaciones", JSON.stringify(newUbicaciones));

      return { success: true };
    } catch (err) {
      console.error("Error al actualizar ubicaciones:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  // Función helper para obtener todas las ubicaciones disponibles
  const getCurrentUbicaciones = () => {
    // Ubicaciones predeterminadas
    const defaultUbicaciones = {
      interior: "Interior",
      exterior: "Exterior",
      terraza: "Terraza",
      barra: "Barra",
      privado: "Privado",
    };

    // Combinar con ubicaciones personalizadas
    return {
      ...defaultUbicaciones,
      ...ubicaciones.ubicacionesDisplay,
    };
  };

  return {
    ubicaciones,
    loading,
    error,
    saving,
    loadUbicaciones,
    updateUbicaciones,
    getCurrentUbicaciones,
  };
};

export default useUbicaciones;
