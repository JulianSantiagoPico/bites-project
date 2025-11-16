import { useState, useEffect } from "react";
import { ocasionesService } from "../services/ocasiones.service";

/**
 * Hook para gestionar las ocasiones del restaurante
 */
export const useOcasiones = () => {
  const [ocasiones, setOcasiones] = useState({
    ocasionesDisplay: {},
    ocasionesList: [],
    ocasionesIcons: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar ocasiones al montar
  useEffect(() => {
    loadOcasiones();
  }, []);

  const loadOcasiones = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await ocasionesService.getOcasiones();
      setOcasiones(
        response.data || {
          ocasionesDisplay: {},
          ocasionesList: [],
          ocasionesIcons: {},
        }
      );
    } catch (err) {
      console.error("Error al cargar ocasiones:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOcasiones = async (newOcasiones) => {
    setSaving(true);
    setError(null);

    try {
      const response = await ocasionesService.updateOcasiones(newOcasiones);
      setOcasiones(response.data);

      // Actualizar localStorage para que esté disponible inmediatamente
      localStorage.setItem("customOcasiones", JSON.stringify(newOcasiones));

      return { success: true };
    } catch (err) {
      console.error("Error al actualizar ocasiones:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  // Función helper para obtener todas las ocasiones disponibles
  const getCurrentOcasiones = () => {
    // Ocasiones predeterminadas
    const defaultOcasiones = {
      ninguna: "Sin ocasión",
      cumpleaños: "Cumpleaños",
      aniversario: "Aniversario",
      cita: "Cita",
      negocio: "Negocio",
      otro: "Otro",
    };

    // Combinar con ocasiones personalizadas
    return {
      ...defaultOcasiones,
      ...ocasiones.ocasionesDisplay,
    };
  };

  return {
    ocasiones,
    loading,
    error,
    saving,
    loadOcasiones,
    updateOcasiones,
    getCurrentOcasiones,
  };
};

export default useOcasiones;
